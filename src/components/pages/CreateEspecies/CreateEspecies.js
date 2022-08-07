import React from 'react';
import './Home.css';
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
		<div className="HomeContainer">
			<NavigationBar text='IDENTIFICADOR DE ESPECIES' />
			<h3>Registro de especies</h3>
				<div>
                            <SocialMedia />
                </div>
			<div className='inputHolder'>
				<input type='file' accept='image/*' capture='camera' className='uploadInput' onChange={uploadImage} ref={fileInputRef} />
				<button className='uploadImage' onClick={triggerUpload}>Subir imagen</button>
				<span className='or'>OR</span>
				<input type="text" placeholder='Paster image URL' ref={textInputRef} onChange={handleOnChange} />
			</div>
			<div className="mainWrapper">
				<div className="mainContent">
					<div className="imageHolder">
						{imageURL && <img src={imageURL} alt="Upload Preview" width="20%" height="20%" crossOrigin="anonymous" ref={imageRef} />}
					</div>
					{results.length > 0 && <div className='resultsHolder'>
						{results.map((result, index) => {
							return (
								<div className='TitleComponent' key={result.className}>
									<table border="1" cellpadding="1" bordercolor="#00CC66">
										<tr><span className='name'>{result.className}</span></tr>
										<tr><span className='LabelItemComponent'>Nivel de confiabilidad: {(result.probability * 100).toFixed(2)}% {index === 0 && <span className='bestGuess'>Best Guess</span>}</span></tr>
									</table>
								</div>
							)
						})}
					</div>}
				</div>
				{imageURL && <button className='button' onClick={identify}>Analizar Imagen</button>}
			</div>
			{history.length > 0 && <div className="recentPredictions">
				<h2>Imagenes Recientes</h2>
				<div>
					{history.map((image, index) => {
						return (
							<div key={`${image}${index}`}>
								<img src={image} alt='Recent Prediction' onClick={() => setImageURL(image)} width="10%" height="10%"/>
							</div>
						)
					})}
				</div>
			</div>}
		</div>
	);
};

export default Home;