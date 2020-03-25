import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Logger from "../logger/Logger";


export default class Footer extends Component{
    constructor(props) {
        super(props);
        this.state= {
            message: null,
            phone: null,
            email: null,
            name: null,
            logger: null,
            loggerType: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.cancelCourse = this.cancelCourse.bind(this);
    }

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e){
        e.preventDefault();
        axios.post('/api/mailer',
            {
                message: this.state.message,
                email: this.state.email,
                name: this.state.name,
                phone: this.state.phone
            })
            .then(res => {
                if (res.data.success){
                    this.setState({
                        message: null,
                        phone: null,
                        email: null,
                        name: null,
                        logger: res.data.success,
                        loggerType: 'success'
                    });
                    this.cancelCourse();
                }
                else {
                    this.setState({
                        logger: res.data.error,
                        loggerType: 'danger'
                    })
                }
            })
            .catch(e => {
                this.setState({
                    logger: 'Une erreur est survenue lors de l\'envoi de votre message',
                    loggerType: 'danger'
                })
            })
    }

    cancelCourse(){
        this.myFormRef.reset();
    };

    render() {
        const {logger, loggerType} = this.state;
        return (
            <div className="footer bg-pink-inherit">
                {logger && loggerType ? <Logger message={logger} type={loggerType} /> : ''}
                <div className="container-fluid">
                    <div className="row align-items-stretch">
                        <div className="col-12">
                            <div className="text-center text-grey h4 p-2"><h2>Contact</h2></div>
                        </div>
                        <div className="col-sm-12 col-lg-6">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11102.376714269722!2d6.143666!3d45.919423!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x647a2d672a0bcf0e!2sInstitut+de+Beaut%C3%A9+Fleuranne!5e0!3m2!1sfr!2sfr!4v1549275358715"
                                 allowFullScreen="" className="w-100 h-100" frameBorder="0" />
                        </div>
                        <div className="col-lg-6 col-sm-12 p-2 mt-2">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12 col-md-10 offset-md-1">
                                        <form ref={(el) => this.myFormRef = el} className="form text-grey mb-3 needs-validation" id="form" onChange={this.handleChange} onSubmit={this.handleSubmit}>
                                            <div className="form-group" id="contact">
                                                <label htmlFor="name">Nom *</label>
                                                <input name="name" id="name" className="form-control" type="text" required={true}/>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="email">Email *</label>
                                                <input name="email" id="email" className="form-control" type="text" required={true} pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="phone">Téléphone *</label>
                                                <input name="phone" id="phone" className="form-control" type="text" required={true}/>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="message">Votre message *</label>
                                                <textarea name="message" className="form-control" required={true}></textarea>
                                            </div>
                                            <div className="text-center">
                                                <button className="btn btn-group btn-grey">Envoyer</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="text-center text-grey mt-1 p-2"><span className="font-weight-lighter">Powered by Back'n Dev</span> </div>
                    </div>
                </div>
            </div>
        )
    }
}
ReactDOM.render(<Footer />, document.getElementById('footer'));