import { Link } from "react-router-dom";

export default function Footer({footercr}) {
    const currentYear = new Date().getFullYear();
  return (
    <>
    <footer className="footer__area mt-3">
      <div className="footer__btm"> 
        <div className="container">
          <div className="row footer__row">
            <div className="col-xxl-12">
              <div className="row">
                <div className="col-md-6 content_footer">
                  <h2 className="logo_size_text"><span className="highlight_text">O</span>xytal</h2>
                  <p>Oxytal is a full-service digital agency specializing in best-in-class digital solutions. The Oxytal team has strong experience in delivering complex technical digital solutions.</p><ul className="footer__social"><li>
                    <a href="https://twitter.com/InfoOxytal"><span><i className="fa-brands fa-twitter"></i></span></a></li><li><a href="https://www.linkedin.com/company/oxytal"><span>
                      <i className="fa-brands fa-linkedin"></i></span></a></li></ul></div><div className="col-md-3 get_in_touch_footer"><h2 className="footer__widget-title">Get In Touch</h2><ul className="footer__contact"><li>Ballydeague, Ballyhooly, Co Cork, Ireland</li><li><a className="phone" href="tel:353866034988">( 353 ) 86 603 4988</a></li><li><a href="mailto:info@oxytal.com">info@oxytal.com</a></li></ul></div><div className="col-md-3 useful_links_footer"><h2 className="footer__widget-title">Useful Links</h2>
                      <ul className="footer__link">
                      <li><a href="https://www.oxytal.com" target="_blank">Oxytal</a></li>
                      <li><a href="https://www.oxytal.com/privacy-policy" target="_blank">Privacy Policy</a></li>

                      </ul>
                    </div></div></div></div></div>
                    
                    </div>
    </footer>
    <div className="copyright-text">Copyright © {currentYear} Oxytal Limited. All Rights Reserved</div>
    </>
  )
}
