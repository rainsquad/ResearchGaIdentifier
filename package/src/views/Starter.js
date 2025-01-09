import React, { useState, useEffect } from "react";
import { Container, Row, Button , Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import SliderComponent from "../components/dashboard/Slider";
import "./Starter.css"; // Import CSS file for styling

const Starter = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [preprocessedText, setPreprocessedText] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Fetch papers from arXiv API
  useEffect(() => {
      if (searchTerm.trim() === "") return;

      const fetchPapers = async () => {
          try {
              const response = await axios.get(
                  `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(searchTerm)}&start=0&max_results=10&sortBy=submittedDate&sortOrder=descending`
              );

              const parser = new DOMParser();
              const xml = parser.parseFromString(response.data, "text/xml");
              const entries = Array.from(xml.getElementsByTagName("entry"));
              console.log(entries)
              const papersData = entries.map((entry) => {
                const links = Array.from(entry.getElementsByTagName("link"));
                const pdfLink = links.find((link) => link.getAttribute("title") === "pdf")?.getAttribute("href") || "#";
    
                  return {
                      id: entry.getElementsByTagName("id")[0]?.textContent || "",
                      title: entry.getElementsByTagName("title")[0]?.textContent || "Untitled",
                      summary: entry.getElementsByTagName("summary")[0]?.textContent || "No summary available.",
                      published: entry.getElementsByTagName("published")[0]?.textContent || "",
                      //link: entry.getElementsByTagName("link")[0]?.getAttribute("href") || "#",
                      link: pdfLink,
                  };
              });

              setPapers(papersData);
          } catch (error) {
              console.error("Error fetching data from arXiv API:", error);
          }
      };

      fetchPapers();
  }, [searchTerm]);

  const fetchPDF = async (pdfUrl) => {
    try {
        const response = await axios.get(pdfUrl, {
            responseType: "blob", // This ensures you get the binary data
        });

        const url = URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "paper.pdf"); // Specify a name for the downloaded file
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Error fetching PDF:", error);
    }
};

  const handlePreprocess = async (paper) => {
    
    setSelectedPaper(paper);
    setShowModal(true);

    try {
        // Assuming a backend API exists for preprocessing
        const response = await axios.post('http://localhost:5070/api/preprocess', { url: paper.link });
        console.log(response.data)
       
        setPreprocessedText(response.data.processedText);
    } catch (error) {
        console.error("Error preprocessing paper:", error);
        setPreprocessedText("Failed to preprocess the paper.");
    }
};


  return (
    <> 
     <Container>
                {/* Header Row with animations */}
                <Row className="justify-content-center text-center py-5">
                    <h1 className="text-light animated fadeInDown">
                        <strong>Explore Academic Discoveries</strong>
                    </h1>
                    <p className="text-light animated fadeInUp delay-1s">
                        Search and uncover research papers from various fields.
                    </p>
                </Row>

                {/* Main Search Bar */}
                <Row className="justify-content-center py-4">
                    <div className="search-bar-container animated bounceIn">
                        <input
                            type="text"
                            placeholder="Search by title, author, or keyword"
                            className="form-control search-bar"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </Row>

                {/* Search Results */}
                <Row className="py-5">
                    <div className="container">
                        <div className="row">
                            {papers.length > 0 ? (
                                papers.map((paper, index) => (
                                    <div key={index} className="col-md-6 col-lg-4 mb-4">
                                        <div className="card windows-tile h-100">
                                            <div className="card-body bg-light">
                                                <h4 className="card-title font-weight-bold text-info">
                                                    {paper.title}
                                                </h4>
                                                <p className="card-text text-dark" style={{ overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
                                                    {paper.summary}
                                                </p>
                                                <Button
                                                    onClick={() => handlePreprocess(paper)}
                                                    className="btn btn-info mt-3"
                                                >
                                                    get content
                                                </Button>

<a
                                                    href={paper.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-info mt-3"
                                                >
                                                    Read More
                                                </a>
                                            </div>
                                           
                                            <div className="card-footer text-muted bg-light">
                                          
                                                <a>
                                                Published: {new Date(paper.published).toLocaleDateString()}

                                                </a>
                                               
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-md-12 text-center">
                                    <p className="text-muted">
                                        {searchTerm.trim() ? "No results found. Try refining your search." : "Start your search to see results here."}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </Row>

                {/* Modal for Preprocessed Text */}
                <Modal isOpen={showModal} toggle={() => setShowModal(false)}>
  <ModalHeader toggle={() => setShowModal(false)}>Preprocessed Text</ModalHeader>
  <ModalBody>
    <h5>{selectedPaper?.title}</h5>
    <pre style={{ whiteSpace: "pre-wrap" }}>{preprocessedText}</pre>
  </ModalBody>
  <ModalFooter>
    <Button color="secondary" onClick={() => setShowModal(false)}>
      Close
    </Button>
  </ModalFooter>
</Modal>
            </Container>
    </>
);
};

export default Starter;
