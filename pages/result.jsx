import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react";

export default function Result() {
    const router = useRouter();
    const { shortUrl } = router.query;
    const sloganRef = useRef();
    const titleRef = useRef();

    const [ showCopy, setShowCopy ] = useState(true);
    const [ copyText, setCopyText ] = useState('Copy');

    const urlString = `https://s-it.vercel.app/${shortUrl}`;

    useEffect(() => {
        const slogan = sloganRef.current;
        const title = titleRef.current;
        if(slogan) {
            slogan.classList.add('slide');
        }
        if(title) {
            title.classList.add('fade');
        }
    },[]);

    const handleReturnButtonClick = () => {
        window.location.assign('/');
    }

    const changeCopyElement =() => {
        navigator.clipboard.writeText(urlString)
        .then(() => {
            setCopyText('Copied');
            setShowCopy(false);
        })
        .catch((err) => {
            setShowCopy(true);
            setCopyText('Copy');
        });
    }

    const handleCopyButtonClick = () => {
        if(!showCopy) {
            setCopyText('Copy');
            setShowCopy(true);
            setTimeout(changeCopyElement, 200);
        } else {
            changeCopyElement();
        }
    }

    const handleHomeClick = () => {
        if(router.pathname !== '/') {
            window.location.assign('/');
        }
    }

    return (
        <div className="main-wrapper">
            <h1 className="title" ref={titleRef}>Short it</h1>
            <div className="home-container" onClick={handleHomeClick} >
                <img src="./home-icon.svg" alt="Home Icon svg" className="home-icon" />
                <p className="home-text">Short it</p>
            </div>
            <p className="slogan" ref={sloganRef}>Let's make things short and simple.</p>
            <div className="main-container">
                <div className="result-box-container">
                    <label className="box-label" htmlFor="result-box-id">Here is your short URL</label>
                    <div
                        type="url"
                        id="result-box-id"
                        className="result-box"
                    >
                        <a className="result-anchor" href={urlString} target="_blank" >{urlString}</a>
                    </div>
                    <button className="result-copy-button" onClick={handleCopyButtonClick}>
                        <div className="restul-copy-icon-container">
                            <img src="/copy-icon.svg" alt="Copy Icon" className={`result-copy-icon ${showCopy ? 'visible' : 'hidden'}`} />
                            <img src="/copy-ok-icon.svg" alt="Copy Icon" className={`result-copy-icon ${!showCopy ? 'visible' : 'hidden'}`} />
                        </div>
                        {copyText}
                    </button>
                </div>
                <button className="button" onClick={handleReturnButtonClick}>Back</button>
            </div>
        </div>
    )
}