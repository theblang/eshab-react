import React, {Component} from 'react'
import * as firebase from 'firebase'

class AccountOverview extends Component {

    constructor() {
        super()
        this.state = {
            account: {}
        }
    }

    componentDidMount() {
        this.accountRef = firebase.database().ref().child('accounts/' + this.props.params.id)
        this.accountRef.on('value', snapshot => {
            this.setState({
                account: snapshot.val() || {},
            })
        })
    }

    componentWillReceiveProps() {
        this.accountRef = firebase.database().ref().child('accounts/' + this.props.params.id)
        this.accountRef.on('value', snapshot => {
            this.setState({
                account: snapshot.val() || {},
            })
        })
    }

    render() {
        return (
            <div>
                {this.state.account.transactions && this.state.account.transactions.map((transaction, i) =>
                    <div key={i}>
                        <div>{transaction.payee}</div>
                        <button onClick={() => this.removeTransaction(transaction)}>Delete</button>
                    </div>
                )}
                <br/>
                <input
                    ref={(payee) => {
                        this.payeeInput = payee
                    }}
                    type="text"
                    placeholder="payee"/>
                <input
                    ref={(category) => {
                        this.categoryInput = category
                    }}
                    type="text"
                    placeholder="category"/>
                <input
                    ref={(memo) => {
                        this.memoInput = memo
                    }}
                    type="text"
                    placeholder="memo"/>
                <input
                    ref={(outflow) => {
                        this.outflowInput = outflow
                    }}
                    type="number"
                    step="any"
                    placeholder="outflow"/>
                <input
                    ref={(inflow) => {
                        this.inflowInput = inflow
                    }}
                    type="number"
                    step="any"
                    placeholder="inflow"/>
                <input onClick={() => this.addTransaction()} type="button" value="Add Transaction"/>
            </div>
        )
    }

    addTransaction() {
        const transactions = this.state.account.transactions || []
        const transaction = {
            payee: this.payeeInput.value,
            category: this.categoryInput.value,
            memo: this.memoInput.value,
            outflow: this.outflowInput.value,
            inflow: this.inflowInput.value
        }

        this.accountRef.update({
            transactions: transactions.concat(transaction)
        })

        this.payeeInput.value = null
        this.categoryInput.value = null
        this.memoInput.value = null
        this.outflowInput.value = null
        this.inflowInput.value = null
    }

    removeTransaction(transaction) {
        const transactions = [...this.state.account.transactions]
        const position = transactions.indexOf(transaction)
        transactions.splice(position, 1)
        this.accountRef.update({
            transactions:transactions
        })
    }
}

export default AccountOverview