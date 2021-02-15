import React, { useState } from 'react'; 
import 'font-awesome/css/font-awesome.min.css';
import './Form.css'
import Modal from 'react-modal';
import { Button,ModalTitle,ModalFooter,ModalBody } from 'react-bootstrap';





class Form extends React.Component{

    state = {
        loading:'none',
        url: '',
        display:'none',
        message:'',
        title:'',
        prediction:'',
        error:'',
        isOpen: false
    
    }
   

    handleChange = event => {
        this.setState({url:event.target.value});
    }

    handleSubmit = event => {
        this.setState({loading:'block'})
        fetch('/parse_url', {
            method: 'POST',
            body: JSON.stringify({"url":this.state.url}),
        }).then(res => res.json())
            .then(data => {
                this.setState({
                    loading:'none',
                    display:'block',
                    message: data.message,
                    title:data.title,
                    prediction:data.prediction,
                    error:data.error,
                    isOpen:'true'
                });
            })
            .catch(err => console.log("Error:", err));
        event.preventDefault();
    }


    // OpenModel = () => {
    //     this.setState({
    //         isOpen: true
    //     })
    // }

    CloseModal = () =>{
       this.setState({
           isOpen: false
       })
    }

 

    render(){

        console.log(this.isOpen)
        const {loading} = this.state.loading


        return (
            <>
                <form onSubmit={this.handleSubmit} className="from_style">
                    <input className="input_section" id="input-url" placeholder="Paste your article link here" value={this.state.url} onChange={this.handleChange} />
                    <input className="input_button" type="submit" value="Submit" />  
                    <div style={{display:this.state.loading}}><i className="fa fa-refresh fa-spin" />   Loading...</div>
                </form>

                <Modal  style={{
                     content:{
                        position: 'absolute',
                        top: '200px',
                        left: '40px',
                        right: '40px',
                        bottom: '150px',
                        border: '1px solid #ccc',
                        background: '#fff',
                        overflow: 'auto',
                        WebkitOverflowScrolling: 'touch',
                        borderRadius: '4px',
                        outline: 'none',
                        padding: '20px'
                 }
                }}
                // isOpen={this.state.message === '' ? false : true}
                isOpen={this.state.isOpen}
                onRequestClose={() => this.CloseModal()}
                shouldCloseOnOverlayClick={true}
                closeTimeoutMS={200}
                ariaHideApp={false}
                
                >


                    <ModalTitle>
                        <p>The title of your article:</p>
                        <h2 id="article_title" >{this.state.title}</h2>
                    </ModalTitle>
                    <ModalBody>

                        <textarea id="article_text" rows="20" cols="100%" readOnly value = {this.state.message} />
                        <h3>The result of the ML detection:</h3>
                        <h1 id="result" className={this.state.prediction === 'FAKE' ? 'red_color' : 'gree_color'} >{this.state.prediction}</h1>

                        <div id="error_div" style={{display: this.state.error === '' ? 'none' : 'block'}}>
                        The following error occurred:
                        <p id="error_message">{this.state.error}</p>
                    </div>

                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={this.CloseModal}  >Close </Button>
                    </ModalFooter>

                </Modal>


                
                    
                    
                
               
            </>
        )
    }
}





export default Form;