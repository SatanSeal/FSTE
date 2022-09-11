import React from "react";

import './about_page.scss';


const AboutPage: React.FC = () => {
    return (
        <div>
            <div>
                About us
            </div>
            {/* Better do using Google Maps API */}
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4448.962273240021!2d135.06014006840485!3d48.468639281800456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5efaea297934199f%3A0x4642001517597cf!2z0J3QsNCx0LXRgNC10LbQvdCw0Y8g0J3QtdCy0LXQu9GM0YHQutC-0LPQvg!5e0!3m2!1sru!2sru!4v1662351724492!5m2!1sru!2sru"
                // width="600"
                width="100%"
                // height="450"
                height="600"
                style={{ border: 0 }}
                // allowFullScreen=''
                loading="lazy"
                referrerPolicy='no-referrer-when-downgrade'
            />
        </div>
    )
}

export default AboutPage;