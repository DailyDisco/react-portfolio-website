// first thing to do is important styles





import './index.scss'
// import LogoS from '../../assets/images/logo-s.png'
// imports LogoS from the assets folder
// import LogoSubtitle from '../../assets/images/logo_sub.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faHome, faUser } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { /*Link, we may later define this when we get a custom logo*/ NavLink } from 'react-router-dom'

const Sidebar = () => {

    return(


    <div className="nav-bar">


    {/* this is edited out because I don't have my own logo yet.


        <Link className="logo" to='/'>



            <img src={LogoS} alt="Logo" />



            <img className="sub-logo" src={LogoSubtitle} alt="Name: Diego Espino" />



        </Link>

    */}


    <nav>



        <NavLink exact="true" activeclassname="active" to="/">



            <FontAwesomeIcon icon={faHome} color="#4d4d4e" />



        </NavLink>



        <NavLink exact="true" activeclassname="active" className="about-link" to="/about">



            <FontAwesomeIcon icon={faUser} color="#4d4d4e" />


            
        </NavLink>




        <NavLink exact="true" activeclassname="active" className="contact-link" to="/contact">



            <FontAwesomeIcon icon={faEnvelope} color="#4d4d4e" />


            
        </NavLink>



        </nav>



        <ul>



            <li>
                <a
                target="_blank" 
                rel="noreferrer" 
                href="https://www.linkedin.com/in/diego-espino-774202232/"
                >
                    <FontAwesomeIcon icon={faLinkedin} color="#4d4d4e" />
                </a>
            </li>



            <li>
                <a

                target="_blank" 
                rel="noreferrer" 
                href="https://github.com/DailyDisco"
                
                >
                    <FontAwesomeIcon icon={faGithub} color="#4d4d4e" />
                </a>
            </li>

    

            <li>
                <a

                target="_blank" 
                rel='noreferrer' 
                href='https://twitter.com/digita1Diego'
                
                >
                    <FontAwesomeIcon icon={faTwitter} color="#4d4d4e" />
                </a>
            </li>

    {/* this is edited out because I don't use these socials yet.

            <li>
                <a

                target="_blank" 
                rel='noreferrer' 
                href='https://github.com/DailyDisco'
                
                >
                    <FontAwesomeIcon icon={faSkype} color="#4d4d4e" />
                </a>
            </li>

    */}


        </ul>

    </div>
    )
}



export default Sidebar