import { useRouter } from 'next/router';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export default function DynamicPage() {
  const router = useRouter();
  const { id } = router.query;
  const sloganRef = useRef();
  const titleRef = useRef();
  const [ showUi, setShowUi ] = useState(false);
  
  
  const [ render, setRender ] = useState(false);


  const fetchData = async () => {
    try {
      const response = await fetch(`https://s-it.vercel.app/api/short?shortCode=${id}`);
      const res = await response.json();
      if(res.redirect) {
        window.location.assign(res.redirect);
      } else {
        setShowUi(true);
        setRender(true);
      }
    } catch (error) {
      setShowUi(true);
      setRender(true);
      console.error('It was not possible to send the short code to the API');
    }
  };

  const initialEffect = async () => {
    await fetchData();
    const slogan = sloganRef.current;
    const title = titleRef.current;
    if (slogan && title) {
      if(slogan) {
          slogan.classList.add('slide');
      }
      if(title) {
          title.classList.add('fade');
      }
    }
  }

  useEffect(() => {
    if(showUi) {
      initialEffect();
    }
  }, [render]);

  useEffect(() => {
    if(id) {
      fetchData();
    }
  }, [id]);

  const handleHomeClick = () => {
      if(router.pathname !== '/') {
          window.location.assign('/');
      }
  }

  return (
    <>
      {showUi && (
                <div className="main-wrapper">
                <h1 className="title" ref={titleRef}>Short it</h1>
                <div className="home-container">
                    <img src="./home-icon.svg" alt="Home Icon svg" className="home-icon" onClick={handleHomeClick} />
                    <p className="home-text">Short it</p>
                </div>
                <p className="slogan" ref={sloganRef}>Let's make things short and simple.</p>
                <div className='dynamic-page-container'>
                  <img src="./sad-face-icon.svg" alt="Sad Face Icon svg" className="sad-face-icon" onClick={handleHomeClick} />
                  <label className="box-label id" htmlFor="result-box-id">The short URL provided is not valid</label>
              </div>
            </div>
      )}
    </>
  );
}