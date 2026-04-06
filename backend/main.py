from fastapi import FastAPI, UploadFile, File
import shutil
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# 🔧 Custom utils
from utils.parser import extract_text_from_pdf
from utils.anonymizer import anonymize_text
from models.bert_model import get_embedding
from utils.explainer import generate_explanation
from utils.skills import extract_skills

from sklearn.metrics.pairwise import cosine_similarity

# 🚀 App init
app = FastAPI()

# 🌐 CORS (for React frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🧠 In-memory storage
resumes = []               # store TEXT
resume_embeddings = []     # store EMBEDDINGS

# ===============================
# 📄 Upload Resume API
# ===============================
@app.post("/upload_resume/")
async def upload_resume(file: UploadFile = File(...)):
    global resumes, resume_embeddings

    file_path = f"data/resumes/{file.filename}"

    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract + clean text
    text = extract_text_from_pdf(file_path)
    text = anonymize_text(text)

    # Generate embedding
    embedding = get_embedding(text)

    # ✅ Store correctly
    resumes.append(text)
    resume_embeddings.append(embedding)

    return {"message": "Resume uploaded successfully"}

# ===============================
# 📊 Request Model
# ===============================
class JobRequest(BaseModel):
    job_description: str

# ===============================
# 🧠 Ranking API
# ===============================
@app.post("/rank/")
async def rank(request: JobRequest):
    scores = []

    # ❌ No resumes case
    if not resumes:
        return {"ranking": [], "message": "No resumes uploaded"}

    # Job embedding
    job_embedding = get_embedding(request.job_description)

    # Loop through resumes
    for i, emb in enumerate(resume_embeddings):
        try:
            # 🔢 Similarity
            similarity = cosine_similarity([job_embedding], [emb])[0][0]

            # 🔍 Skills
            skills = extract_skills(resumes[i] or "")

            # 🤖 Explanation
            explanation = generate_explanation(
                request.job_description,
                resumes[i] or ""
            )

            # 📊 Smart scoring
            skill_score = len(skills) / 10
            experience_score = resumes[i].lower().count("experience") * 0.05 if resumes[i] else 0

            final_score = (
                0.6 * similarity +
                0.3 * skill_score +
                0.1 * experience_score
            )

            # ✅ Append safe data
            scores.append((
                int(i),
                float(final_score),
                str(explanation),
                list(skills)
            ))

        except Exception as e:
            print("Error in ranking:", e)

    # 🏆 Sort results
    ranked = sorted(scores, key=lambda x: x[1], reverse=True)

    return {"ranking": ranked}
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet

@app.get("/download/")
def download_report():
    doc = SimpleDocTemplate("report.pdf")
    styles = getSampleStyleSheet()
    content = []

    for i, r in enumerate(resumes):
        content.append(Paragraph(f"Candidate {i}", styles["Normal"]))
        content.append(Paragraph(r[:200], styles["Normal"]))

    doc.build(content)

    return {"message": "Report generated successfully"}
from fastapi import HTTPException
from auth import create_token

users = {"admin": "1234"}

@app.post("/login/")
def login(username: str, password: str):
    if users.get(username) != password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({"user": username})
    return {"access_token": token}