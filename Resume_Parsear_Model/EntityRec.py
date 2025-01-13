

import torch
from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline

def load_ner_model():
    """
    Load a pre-trained BERT-based Named Entity Recognition (NER) model.
    Returns a Hugging Face pipeline for NER.
    """
    model_name = "dbmdz/bert-large-cased-finetuned-conll03-english"  # Pre-trained NER model
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForTokenClassification.from_pretrained(model_name)
    ner_pipeline = pipeline("ner", model=model, tokenizer=tokenizer, grouped_entities=True)
    return ner_pipeline

def extract_named_entities(text, ner_pipeline):
    """
    Perform named entity recognition on the given text using the provided NER pipeline.
    
    Args:
        text (str): The input text to process.
        ner_pipeline: A Hugging Face NER pipeline object.

    Returns:
        list: A list of identified entities with their types and spans.
    """
    return ner_pipeline(text)

if __name__ == "__main__":
    # Load the model
    ner_pipeline = load_ner_model()

    # Sample input text (replace with preprocessed text from your Node.js backend)
    sample_text = "Dr. John Doe from Stanford University published a paper on Natural Language Processing in 2023."

    # Extract named entities
    entities = extract_named_entities(sample_text, ner_pipeline)

    print("Extracted Entities:")
    for entity in entities:
        print(f"Entity: {entity['word']}, Type: {entity['entity_group']}, Score: {entity['score']:.2f}")
