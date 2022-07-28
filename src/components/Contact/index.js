import { useEffect, useState } from 'react'
import Loader from 'react-loaders'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useRef } from 'react'
import emailjs from '@emailjs/browser'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'




const Contact = () => {



    // this is a useState "hook". This "hook" sets the initial value for our classes.
    const [letterClass, setLetterClass] = useState('text-animate')

    const form = useRef()

    // this is a hook used for changing classes after 4 seconds have passed.
    useEffect(() => {
        setTimeout(() => {
            setLetterClass('text-animate-hover')
        }, 3000)
    }, [])



    const sendEmail = (e) => {
        e.preventDefault()
    
        emailjs
          .sendForm(
            'service_x9eyeta',
            'template_f4q0edh',
            form.current,
            'Gip3snFovpUWaqP6V'
          )
          .then(
            () => {
              alert('Message successfully sent!')
              window.location.reload(false)
            },
            () => {
              alert('Failed to send the message, please try again')
            }
          )
      }
      
      



    return (
    <>
        <div className='container contact-page'>
            <div className='text-zone'>
                <h1>
                    <AnimatedLetters 
                    letterClass={letterClass}
                    strArray={['C', 'o', 'n', 't', 'a', 'c', 't', ' ', 'M', 'e']}
                    idx={15}
                    />
                </h1>
                <p>
                    I am interested in <em className='keywords'>remote and hybrid work oppurtunities</em>, especially those oppurtunities that
                    include working in teams on large projects, or testing and debugging. I can 
                    <em className='keywords'> collaborate in English and Spanish</em> if needed.
                    
                    
                    If you have <em className='keywords'>any questions or requests,</em> please reach out using either my email - 
                    <em className='keywords' 
                    onClick={() =>  navigator.clipboard.writeText('DiegoEspinoWork@gmail.com')}>
                    <button id="normalColor"> DiegoEspinoWork@gmail.com</button>
                    
                    
                    </em> - the form below, or <em className='keywords'>any of my socials</em> on <a className='normalLinkText' href="https://github.com/DailyDisco">GitHub</a>, <a className='normalLinkText' href="https://www.linkedin.com/in/diego-espino-774202232/">LinkedIn</a>, or <a className='normalLinkText' href="https://twitter.com/digtiaIDiego">Twitter</a>.
        

                </p>
                <div className='contact-form'>


                    {/* this is edited out because I need to correctly set up emailjs */}
                
                    <form ref={form} onSubmit={sendEmail}>
                        <ul>
                            <li className='half'>
                                <input 
                                type="text" 
                                name="name" 
                                placeholder="Name" 
                                required />
                            </li>

                            <li className='half'>
                                <input 
                                type="email" 
                                name="email" 
                                placeholder="Email" 
                                required 
                                />
                            </li>

                            <li>
                                <input 
                                placeholder="Subject" 
                                type="text" 
                                name="subject" 
                                required />
                            </li>
                            
                            <li>
                                <textarea 
                                placeholder="Message" 
                                name="message" 
                                required
                                ></textarea>
                            </li>
                            <li>
                                <input 
                                type="submit"
                                className="flat-button"
                                value="SEND" /> 
                            </li>
                        </ul>
                        
                    </form>

    
                </div>
            </div>

            <div className="info-map">
                Diego Espino
                <br />
                Dallas, Texas
                <br />
                United States
                <br />
                <span>DiegoEspinoWork@gmail.com</span>
            </div>
                
            <div className="map-wrap">
                <MapContainer center={[32.776272, -96.796856]} zoom={10}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[32.776272, -96.796856]}>
                    <Popup>If you are hiring around this area, message me!</Popup>
                    </Marker>
                </MapContainer>
            </div>


        </div>
        <Loader type="pacman" />
    </>)
}



export default Contact