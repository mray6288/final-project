import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root')

export default class CountdownModal extends React.Component {
  constructor() {
    super();

    this.state = {
      modalIsOpen: false,
      counter: 3
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  // componentDidMount(){
  //   this.initiateCountdown()
  // }

  componentWillReceiveProps(prevProps){
    if(prevProps.modalKey !== this.props.modalKey){
      this.initiateCountdown()
    }
  }

  initiateCountdown(){
    this.openModal()
    this.interval = setInterval(this.decrementCountdown, 1000)
  }

  decrementCountdown = () => {
    if (this.state.counter > 1){
      this.setState({counter: this.state.counter - 1})
    } else if (this.state.counter === 'GO!'){
      clearInterval(this.interval)

      this.closeModal()
      this.setState({counter: 3})
    } else {
      this.setState({counter: 'GO!'})
    }
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  render() {
    return (
      <div>
        <Modal
          isOpen={this.state.modalIsOpen}

          style={customStyles}
          contentLabel="Example Modal"
        >

          <h1>{this.state.counter}</h1>
        </Modal>
      </div>
    );
  }
}

