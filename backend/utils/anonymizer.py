import spacy

nlp = spacy.load("en_core_web_sm")

def anonymize_text(text):
    doc = nlp(text)
    anonymized = text
    
    for ent in doc.ents:
        if ent.label_ in ["PERSON", "EMAIL", "PHONE"]:
            anonymized = anonymized.replace(ent.text, "[REDACTED]")
    
    return anonymized