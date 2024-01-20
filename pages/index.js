import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react"

export default function Index() {
    const inputRef = useRef();
    const sloganRef = useRef();
    const titleRef = useRef();
    const router = useRouter();

    const [ alertMsg, setAlertMsg ] = useState('');
    const [fadeOut, setFadeOut] = useState(false);
    const [errorCount, setErrorCount] = useState(0);
    const [ loading, setLoading ] = useState(false);
    const [ disableBtn, setDisableBtn ] = useState(false);

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

    useEffect(() => {
        setFadeOut(false);

        const timeoutId = setTimeout(() => {
        setFadeOut(true);
        }, 1500);

        return () => {
        clearTimeout(timeoutId);
        };
    }, [errorCount, alertMsg]);

    const handleButtonClick = async () => {
        const url = inputRef.current.value;
        if(!url) {
            setErrorCount((prevCount) => {
                return prevCount + 1
            });
            setAlertMsg('Please enter a URL');
        } else {
            try {
                const urlObj = new URL(url);
                if (!['http:', 'https:'].includes(urlObj.protocol)) {
                    throw new Error('Invalid URL scheme');
                }
                try {
                    setLoading(true);
                    setDisableBtn(true);
                    const data = { url:  url};
                    const response = await fetch('/api/short', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    });
                    const res = await response.json();
                    router.push({
                        pathname: '/result',
                        query: { shortUrl: res.shortUrl }
                    })
                } catch(error) {
                    console.error('It was not possible to send the URL to the backend API');
                }
                finally {
                    setLoading(false);
                    setDisableBtn(false);
                }
            } catch(error) {
                setErrorCount((prevCount) => {
                    return prevCount + 1
                });
                setAlertMsg('Please enter a valid URL');
            }
        }
    }

    const handleKeyDown = (e) => {
        if(e.key === 'Enter') {
            handleButtonClick();
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
            <div className="home-container">
                <img src="./home-icon.svg" alt="Home Icon svg" className="home-icon" onClick={handleHomeClick} />
                <p className="home-text">Short it</p>
            </div>
            <p className="slogan" ref={sloganRef}>Let's make things short and simple.</p>
            <div className="main-container">
                <label className="index-input-label" htmlFor="index-input-id">Enter your long URL here</label>
                    <div className="index-input-container">
                        <input
                            type="url"
                            id="index-input-id"
                            className="index-input"
                            placeholder="URL"
                            ref={inputRef}
                            autoComplete="off"
                            onKeyDown={handleKeyDown}
                        />
                        <img src="./enter-icon.svg" alt="Enter Icon Img" className="index-enter-icon" onClick={handleButtonClick}></img>
                    </div>
                    <p className={`alert-message ${fadeOut ? 'fade-out' : ''}`}>{alertMsg}</p>
                    {loading && (
                        <div className="loader-container">
                            <div className="loader"></div>
                        </div>
                    )}
                <button className="button index" disabled={disableBtn} onClick={handleButtonClick}>Short it</button>
            </div>
        </div>
    )
}