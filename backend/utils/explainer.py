def generate_explanation(job_desc, resume_text):
    job_words = set(job_desc.lower().split())
    resume_words = set(resume_text.lower().split())

    matched = list(job_words.intersection(resume_words))

    if not matched:
        return "Candidate has limited alignment with job requirements."

    return (
        f"This candidate is a strong match because they demonstrate "
        f"expertise in {', '.join(matched[:3])}, which aligns well with the job requirements."
    )