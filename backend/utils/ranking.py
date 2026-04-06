from sklearn.metrics.pairwise import cosine_similarity

def rank_candidates(job_embedding, resume_embeddings):
    scores = []
    
    for i, emb in enumerate(resume_embeddings):
        similarity = cosine_similarity([job_embedding], [emb])[0][0]
        
        # 🔥 FIX: convert numpy → python types
        scores.append((int(i),float(final_score),explanation,skills,resumes[i][:500]))
    
    ranked = sorted(scores, key=lambda x: x[1], reverse=True)
    return ranked