import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export default class Cookies extends Component{
    constructor(props) {
        super(props);
        this.state = {
            validated: false,
            isLoaded: false
        };
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount(){
        const getSession = new Promise(resolve => resolve(this.getSession()));
        getSession.then(res => {
            if (!res){
                this.setState({
                    isLoaded: true
                })
            }
            else {
                this.setState({
                    isLoaded: true,
                    validated: true
                })
            }
        })
    }

    getSession(){
        return JSON.parse(sessionStorage.getItem('cookie'));
    }

    handleClick(){
        sessionStorage.setItem('cookie', 'true');
        this.setState({
            validated: true
        })
    }


    render() {
        const {isLoaded, validated} = this.state;
        if (!isLoaded){
            return (
                <div> </div>
            )
        }
        else if (isLoaded && !validated){
            return (
             <div className="position-fixed fixed-bottom p-5 bg-grey-inherit">
                 <div className="text-pink text-center">
                     En continuant la navigation vous acceptez que des cookies soient stokés sur votre navigateur, vous pouvez à tout moment éffacer ces cookie dans les paramètres de votre navigateur .
                 </div>
                 <div className="text-center mt-2 mb-2">
                     <button className="btn btn-group btn-pink" onClick={this.handleClick}>Ok, tout accepter</button>
                 </div>
             </div>
            )
        }
        else {
            return (
                <div>

                </div>
            );
        }
    }
}

ReactDOM.render(<Cookies/>, document.getElementById('cookie'));