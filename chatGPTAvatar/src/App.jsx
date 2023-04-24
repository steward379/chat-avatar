import { useState, useEffect } from "react";
import loadingGif from "./assets/loading.gif";
import lens from "./assets/lens.png";
import './App.css';

function App() {
  const [question, updateQuestion] = useState("");
  const [answers, setAnswers] = useState([]);

  const [isComposing, setIsComposing] = useState(false);
  const [timerId, setTimerId] = useState(null);

  const [imageUrl, setImageUrl] = useState("");
  const [uploadImage, setUploadImage] = useState(false);
  const [loading, setLoading] = useState(false);
  


  function handleImageUpload(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImageUrl(reader.result);
      setUploadImage(true);
    };

    reader.readAsDataURL(file);
  }

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  useEffect(() => {
    if (!question?.trim?.() && question !== undefined) {
      setAnswers([]);
    }
  }, [question]);

  const sendQuestion = async (event) => {
    if (!question || question.trim() === "") {
      return;
    }
    if (isComposing) {
      return;
    }

    //composition event
    console.log('prompt', question)

    try {
      setLoading(true);

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      };
  
      const res = await fetch("/api/ask", requestOptions);

      console.log('sent', question)

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      const { message } = await res.json();
      // setAnswer(message);
      setAnswers([...answers, message])

    } catch (err){
      console.error(err, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <div className="app-container">
        <div className="spotlight__wrapper">
          <textarea
            type="text"
            cols="5" rows="2"
            className="spotlight__input"
            placeholder="Ask me anything..."
            onChange={(e) => updateQuestion(e.target.value)}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onKeyDown={(e) => {if(e.key === 'Enter') {sendQuestion();}}}
            disabled={loading}
            style={{
              display: "block",
              backgroundImage: loading ? `url(${loadingGif})` : `url(${lens})`,
            }}
          /><p>{question}</p>
         <hr></hr>
          <div className="spotlight__answer">
            {/* {answer && <p>{answer}</p>} */}
            {answers.map((answer, index) =>  (
            <p key={index}>
              {answer}
              <br />
            </p>
           ))}
          </div>
        </div>
        <div>
          <input type='file' onChange={handleImageUpload} /> 
          <br></br>
          { uploadImage && (
                <img 
                id="myImg" 
                src={imageUrl} 
                // src= {uploadImage ? imageUrl : lens }
                alt="uploaded image" 
                height="500"
            />
          )}

        </div>
      </div>
    </div>
  )
}

export default App;

          // {/* <img 
          //   id="myImg" 
          //   src={require("./assets/lens.png")} 
          //   alt="your image"
          //   height="200"
          //   width="200"
          // /> */}
