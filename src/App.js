import React from 'react';
import logo from './logo.svg';
import './App.css';
import Timer from "./Timer";
import axios from 'axios'

function App() {

    const [useCase, setUseCase] = React.useState('')
    const [triplets, setTriplets] = React.useState([])
    const [loading, setLoading] = React.useState(false)

    // const spliEts = sentence => {
    //     const twoPieces = sentence?.trim().split("et");
    //     // Le système enregistre et confirme l’ajout du nouveau produit
    //     const first = twoPieces[0];
    //     const firstWithoutVerb = first.trim().split(" ").filter((word, index)=> index !== first.trim().split(" ").length -1).toString().replace(",", " ");
    //     const second = twoPieces[1];
    //     const secondWithoutVerb = second.trim().split(" ").filter((word, index)=> index !== 0).toString().replace(",", " ");
    //    return [firstWithoutVerb.concat(second), first.concat(secondWithoutVerb)];
    // }

    const onSubmit = evt => {
        setTriplets([])
        evt.preventDefault();
        setLoading(true);
        const sentences = useCase?.trim()?.split(".");
            //.flatMap(sentence => sentence.includes("et") ? spliEts(sentence) : [sentence])

        const toWord = sentence => {
            return {words: sentence?.trim()?.split(" "), content: sentence, status: 'RAW'}
        }
        const richSentences = sentences?.map(sentence => toWord(sentence))
        axios.post(
            'http://localhost:8080/api/parser',
            {body: richSentences}
            )
            .then(function (response) {
              setTriplets(response.data)
                setLoading(false);
            })
            .catch(function (error) {
                // handle error
                setLoading(false);
                console.log(error);
            })

    }
    const onChange = ({target:{value}}) => {
       setUseCase(value);
    }

    const tripletBox = triplet => <p> {triplet.subject},{triplet.verb}, {triplet.complement}</p>

  return (
    <div className="App">
      <header className="App-header">
      <form id="noter-save-form" method="POST" onSubmit={onSubmit}>
        {loading && (<div>Traitement en cours....</div>)}
         <div><textarea rows="6" cols="50" id="noter-text-area" name="textarea" onChange={onChange} value={useCase} /></div>
         <div><input type="submit" value="submit" onClick={onSubmit} disabled={loading} /></div>
      </form>
       {triplets?.length > 0 && (<div>{triplets.map(triplet => tripletBox(triplet))}</div>)}
      </header>
    </div>
  );
}

export default App;
