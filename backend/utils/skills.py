SKILLS = [
    "python", "machine learning", "nlp",
    "react", "node", "sql", "tensorflow", "java"
]

def extract_skills(text):
    if not text:
        return []

    text = text.lower()
    return [skill for skill in SKILLS if skill in text]