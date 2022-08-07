import React from 'react';
import './index.css';
import NavigationBar from '../../commons/NavigationBar';
import { useState, useEffect, useRef } from 'react';
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";



const SocialMedia = ({ icon }) => {
    return (
        <div>
            <img src={icon} />
        </div>
    )
};


const Home = () => {

    let ac = localStorage.getItem('account')
    let account = JSON.parse(ac)

    tf.setBackend("cpu");
	//const [nombreEspecie, setEspecie] = useState("");
	//const [nombreCientifico, setNcientifico] = useState("");
	//const [ubicacion, setUbicacion] = useState("");
	//const [descripcion, setDescripcion] = useState("");
    const [isModelLoading, setIsModelLoading] = useState(false)
  const [model, setModel] = useState(null)
  const [imageURL, setImageURL] = useState(null);
	const [results, setResults] = useState([])
	const [history, setHistory] = useState([])

	const imageRef = useRef()
	const textInputRef = useRef()
	const fileInputRef = useRef()

	const loadModel = async () => {
		setIsModelLoading(true)
		try {
			const model = await mobilenet.load()
			setModel(model)
			setIsModelLoading(false)
		} catch (error) {
			console.log(error)
			setIsModelLoading(false)
		}
	}

	const uploadImage = (e) => {
		const { files } = e.target
		if (files.length > 0) {
			const url = URL.createObjectURL(files[0])
			setImageURL(url)
		} else {
			setImageURL(null)
		}
	}

	const identify = async () => {
		textInputRef.current.value = ''
		const results = await model.classify(imageRef.current)
		setResults(results)
	}

	const handleOnChange = (e) => {
		setImageURL(e.target.value)
		setResults([])
	}

	const triggerUpload = () => {
		fileInputRef.current.click()
	}

	useEffect(() => {
		loadModel()
	}, [])

	useEffect(() => {
		if (imageURL) {
			setHistory([imageURL, ...history])
		}
	}, [imageURL])

	if (isModelLoading) {
		return <h2>Model Loading...</h2>
	}

	return (
		
        <div className="App">
			<NavigationBar text='Registro de Especies'/>
            <div className='inputHolder'>
                <input type='file' accept='image/*' capture='camera' class='boton_personalizado'onChange={uploadImage} ref={fileInputRef} /> 
                <div ref={textInputRef} onChange={handleOnChange} />
            </div>
            <div className="mainWrapper">
                <div className="mainContent">
                    <div className="imageHolder">
                        {imageURL && <img src={imageURL} alt="Upload Preview" class="img" crossOrigin="anonymous" ref={imageRef} />}
                    </div>
                    {results.length > 0 && <div className='resultsHolder'>
                        {results.map((result, index) => {
                            return (
                                <div className='result' key={result.className}>
									<table class='table'>
									<tr ><span className='name'>{result.className}</span></tr>
										<tr><span className='confidence'>Nivel de confiabilidad:: {(result.probability * 100).toFixed(2)}% {index === 0 && <span className='bestGuess'>Best Guess</span>}</span></tr>
									</table>
                                </div>
                            )
                        })}
                    </div>}
                </div>
                {imageURL && <button class='boton_personalizado' onClick={identify}>Analizar Imagen</button>}
            </div>
            {history.length > 0 && <div className="recentPredictions"><br></br><br></br>
				<hr></hr>
                <h2 >Imagenes Recientes</h2> 
                <div><br></br><br></br>
                    {history.map((image, index) => {
                        return (
                            <div className="recentImages" key={`${image}${index}`}>
                                <img src={image} alt='Recent Prediction' onClick={() => setImageURL(image)}margin-left="3%" width="10%"  />
                            </div>
                        )
                    })}
                </div>
            </div>}
        </div>
	);
};

export default Home;