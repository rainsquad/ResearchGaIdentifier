
from flask import Flask, request, jsonify
from flask_cors import CORS
import spacy
import requests
import fitz  # PyMuPDF
import spacy
from gensim import corpora
from gensim.models.ldamodel import LdaModel


app = Flask(__name__)
CORS(app)


app = Flask(__name__)
nlp = spacy.load("en_core_web_sm")

@app.route('/api/preprocess', methods=['POST'])
def process_paper():
    try:
        # Get PDF URL from frontend
        data = request.json
        pdf_url = data.get("url")

        # Download the PDF
        response = requests.get(pdf_url)
        pdf_path = "paper.pdf"
        with open(pdf_path, "wb") as file:
            file.write(response.content)

        # Extract text from PDF
        text = ""
        with fitz.open(pdf_path) as doc:
            for page in doc:
                text += page.get_text()

        # Clean and preprocess text
        text = " ".join(text.split())  # Simple cleaning
        doc = nlp(text)
        tokens = [token.text for token in doc if not token.is_stop and not token.is_punct]

        # Prepare for topic modeling
        dictionary = corpora.Dictionary([tokens])
        corpus = [dictionary.doc2bow(tokens)]

        # Perform topic modeling
        lda_model = LdaModel(corpus=corpus, id2word=dictionary, num_topics=5, random_state=42)
        topics = lda_model.print_topics()

        # Return results
        return jsonify({"tokens": tokens, "topics": topics})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__': 
    app.run(debug=True)
