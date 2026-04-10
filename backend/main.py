import os
import shutil
from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

# 🔐 Auth & DB
from database import Base, engine, SessionLocal
from models.user import User
from auth import hash_password, verify_password, create_token

# 🔧 Utils
from utils.parser import extract_text_from_pdf
from utils.anonymizer import anonymize_text
from models.bert_model import get_embedding
from utils.explainer import generate_explanation
from utils.skills import extract_skills

from sklearn.metrics.pairwise import cosine_similarity

# 📁 Create folder
os.makedirs("data/resumes", exist_ok=True)

# 🚀 App init
app = FastAPI()

# 🗄️ Create DB
Base.metadata.create_all(bind=engine)

# 🌐 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🧠 In-memory storage
resumes = []
resume_embeddings = []

# ===============================
# 🗄️ DB Dependency
# ===============================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ===============================
# 🔐 AUTH APIs
# ===============================

# ✅ Register schema
class RegisterRequest(BaseModel):
    username: str
    password: str


# ✅ Login schema
class LoginRequest(BaseModel):
    username: str
    password: str


# 🔐 REGISTER
@app.post("/register/")
def register(data: RegisterRequest, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.username == data.username).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = User(
        username=data.username,
        password=hash_password(data.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}


# 🔐 LOGIN
@app.post("/login/")
def login(data: LoginRequest, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.username == data.username).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    if not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid password")

    token = create_token({"user": user.username})

    return {"access_token": token}

# ===============================
# 📄 Upload Resume
# ===============================
@app.post("/upload_resume/")
async def upload_resume(files: list[UploadFile] = File(...)):
    global resumes, resume_embeddings

    uploaded_files = []

    for file in files:
        file_path = f"data/resumes/{file.filename}"

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        text = extract_text_from_pdf(file_path)
        text = anonymize_text(text)

        embedding = get_embedding(text)

        resumes.append(text)
        resume_embeddings.append(embedding)

        uploaded_files.append(file.filename)

    return {
        "message": "Resumes uploaded successfully",
        "files": uploaded_files
    }

# ===============================
# 📊 Request Model
# ===============================
class JobRequest(BaseModel):
    job_description: str

# ===============================
# 🔒 TOKEN VERIFY (PROTECTION)
# ===============================
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return credentials.credentials

# ===============================
# 🧠 Ranking API (PROTECTED)
# ===============================
@app.post("/rank/")
async def rank(request: JobRequest, token: str = Depends(verify_token)):
    scores = []

    if not resumes:
        return {"ranking": [], "message": "No resumes uploaded"}

    job_embedding = get_embedding(request.job_description)

    for i, emb in enumerate(resume_embeddings):
        try:
            similarity = cosine_similarity([job_embedding], [emb])[0][0]

            skills = extract_skills(resumes[i] or "")

            explanation = generate_explanation(
                request.job_description,
                resumes[i] or ""
            )

            skill_score = len(skills) / 10
            experience_score = resumes[i].lower().count("experience") * 0.05

            final_score = (
                0.6 * similarity +
                0.3 * skill_score +
                0.1 * experience_score
            )

            scores.append((
                int(i),
                float(final_score),
                explanation,
                skills
            ))

        except Exception as e:
            print("Error:", e)

    ranked = sorted(scores, key=lambda x: x[1], reverse=True)

    return {"ranking": ranked}

# ===============================
# 📄 REPORT DOWNLOAD
# ===============================
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

    return {"message": "Report generated"}