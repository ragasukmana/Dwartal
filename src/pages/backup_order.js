import React from 'react'
import { withRouter } from 'react-router-dom'
import {
    Segment,
    Card,
    Icon,
    Grid,
    Header,
    Button,
    Input,
    Menu,
    CardContent,
    Dropdown,
    Responsive
} from 'semantic-ui-react'
import axios from 'axios'

class Order extends React.Component {

    componentDidMount() {
        this.GetListOrder()
    }
    state = {
        dataProduct: [],
        cart: [],
        order: [],
        grandTotal: 0,
        name: [],
        input: "",
        name: '',
        limit: 6,
        offset: 0,
        sortby: '',
        category: '',
        TotalPage: 0
    }

    GetListOrder = () => {
        axios.get(`http://127.0.0.1:3003/products?limit=${this.state.limit}&offset=${this.state.offset}&
        category=${this.state.category}`)
            .then(res => {
                if (res.status === 200) {
                    this.setState({ dataProduct: res.data.data.result, TotalPage:res.data.data.TotalPage})
                }
                console.log(res.data.data);
                
            })
            .catch(err => {
            })
    }
    increaseOrder = (event, price) => {
        this.setState({
            order: this.state.order.map((order) => (order.id == event.target.id ?
                { ...order, quantity: order.quantity + 1, totalPrice: price * (order.quantity + 1) } : order)),
            grandTotal: this.state.grandTotal + parseInt(price)
        }, () => {

        })

    }
    decreaseOrder = (event, price) => {
        this.setState({
            order: this.state.order.map((order) => (order.id == event.target.id ?
                { ...order, quantity: order.quantity - 1, totalPrice: price * (order.quantity - 1) } : order)),
            grandTotal: this.state.grandTotal - parseInt(price)

        })

    }
    onSelectProduct = (event, data) => {
        let checkProduct = []
        if (this.state.cart.length === 0) {
            this.setState({
                cart: [...this.state.cart, data],
                order: [...this.state.order, {
                    id: data.id,
                    name: data.name,
                    price: data.price,
                    quantity: 1,
                    totalPrice: data.price * 1
                }],
                grandTotal: this.state.grandTotal + parseInt(data.price)
            }, () => {

            })
        } else {
            this.state.cart.map((item, index) => {
                if (item.id === data.id) {
                    checkProduct.push('1')
                }
            })
            if (checkProduct.length === 0) {
                this.setState({
                    cart: [...this.state.cart, data],
                    order: [...this.state.order, {
                        id: data.id,
                        name: data.name,
                        price: data.price,
                        quantity: 1,
                        totalPrice: data.price * 1

                    }],
                    grandTotal: this.state.grandTotal + parseInt(data.price)
                }, () => {

                })
            } else {

            }
        }
    }
    deleteListCart = (event) => {
        var totalPrice = 0
        this.state.order.map((order, index) => {
            if (order.id == event.target.id) {
                totalPrice = order.totalPrice
            }
        })
        let cartForDelete = this.state.cart.filter((data) => {
            return data.id != event.target.id
        })
        let orderForDelete = this.state.cart.filter((data) => {
            return data.id != event.target.id

        })
        this.setState({
            cart: cartForDelete,
            order: orderForDelete,
            grandTotal: (this.state.grandTotal - parseInt(totalPrice)) || 0
        });
    }
    onCheckOut = async (event) => {
        const body = {
            user_id: 43,
            order: this.state.order
        }
        await axios.post('http://127.0.0.1:3003/order/', body).then(
            res => {
                if (res.status === 200) {
                    this.setState({
                        cart: [],
                        order: [],
                        grandTotal: 0
                    })
                    alert("Order Already Set")

                }

            })

    }
    onSearch = async (event, { name, limit, offset, sortby, category}) => {
        event.preventDefault()
        await this.setState((prevState, currentState) => {
            return {
                ...prevState,
                name: name || prevState.name,
                sortby: sortby || prevState.sortby,
                category: category || prevState.category,
                limit: limit || prevState.limit,
                offset: offset || 0
            }
        })
        if (name !== '') {
            await axios.get(`http://127.0.0.1:3003/products?name=${this.state.name}&limit=${this.state.limit}
            &offset=${this.state.offset}&sortby=${this.state.sortby}&category=${this.state.category}`)
                .then(res => {
                    this.setState((prevState, currentState) => {
                        return {
                            ...prevState,
                            dataProduct: [...res.data.data.result]
                        }
                    })
                })
        } else {
            await axios.get(`http://127.0.0.1:3003/products?`)
                .then(res => {
                    this.setState((prevState, currentState) => {
                        return {
                            ...prevState,
                            dataProduct: [...res.data.data.result]
                        }
                    })
                })
        }
    }
    render() {
        return (
            <Grid >
                <Grid.Row>
                    <Grid.Column width={1}>
                        <Menu compact icon='labeled' vertical>
                            <Menu.Item name='Manu' >
                                <Icon name='book' />
                                List Menu
                        </Menu.Item>
                        </Menu>
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Segment.Group>
                            <Responsive as={Segment}>
                                <Menu secondary>
                                    <Menu.Item> Sorting By :</Menu.Item>
                                    <Menu.Item name='Newest'
                                        onClick={(event) => this.onSearch(event, {sortby: 'dateadd DESC'})} />
                                    <Dropdown item text='Name'>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={(event) => this.onSearch(event, {sortby:'name ASC'})}>Name(A-Z)</Dropdown.Item>
                                            <Dropdown.Item onClick={(event) => this.onSearch(event, {sortby: 'name DESC'})}>Name(Z-A)</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <Dropdown item text='Price'>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={(event) => this.onSearch(event, {sortby: 'price DESC'})}>Price Higher</Dropdown.Item>
                                            <Dropdown.Item onClick={(event) => this.onSearch(event, {sortby: 'price ASC'})}>Price Lower</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <Dropdown item text='Category'>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={(event) => this.onSearch(event, {category:'1'})}>Food</Dropdown.Item>
                                            <Dropdown.Item onClick={(event) => this.onSearch(event, {category: '2'})}>Drink</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <Menu.Menu position='right'>
                                        <Menu.Item>
                                            <Responsive>
                                                <Input icon='search' placeholder='Search...' onChange={(event) => this.onSearch(event, { name: event.target.value })} />
                                            </Responsive>
                                        </Menu.Item>
                                    </Menu.Menu>
                                </Menu>
                            </Responsive>
                            <Segment>
                                <div style={{
                                    display: 'flex', flexWrap: 'wrap',
                                    justifyContent: 'space-evenly', alignSelf: 'auto'
                                }}>
                                    {this.state.dataProduct.map((item, index) => {
                                        return (
                                            <div style={{ marginBottom: 20 }}>
                                                <Card onClick={(event) => this.onSelectProduct(event, item)}>
                                                    <img alt="" height={200} src={`http://localhost:3003/` + `${item.image}`} wrapped ui={false} />
                                                    <Card.Content>
                                                        <Card.Header>{item.name}</Card.Header>
                                                        <Card.Description> Price : Rp.{item.price}
                                                        </Card.Description>
                                                    </Card.Content>
                                                </Card>
                                            </div>
                                        )
                                    })}
                                </div>
                            </Segment>
                        </Segment.Group>
                        <Button.Group>
                            {
                                [...Array(this.state.TotalPage)].map((e, i) =>
                                    <Button onClick={(event) => this.onSearch(event, { offset: i*this.state.limit})}
                                        key={i + 1}> {i + 1}
                                    </Button>
                                )
                            }
                        </Button.Group>
                    </Grid.Column>
                    <Grid.Column width={5}>
                        <Segment.Group>
                            <Segment>
                                <Header as='h2' textAlign='center'>List Cart</Header>
                            </Segment>
                            <Segment>
                                <Card.Group>
                                    {this.state.order.map((item, index) => {
                                        return (
                                            <Card fluid color='red'>
                                                <CardContent>
                                                    <div>
                                                        <Header as='h3' textAlign='center'>{item.name}  Rp.{item.price}</Header>
                                                    </div>
                                                    <center>
                                                        <div style={{ float: 'center', marginTop: 8 }}>
                                                            <Button.Group size='mini'>
                                                                <Button id={item.id} onClick={(event) => this.increaseOrder(event, item.price)} >
                                                                    <Icon name='add' />
                                                                    Add
                                                                </Button>
                                                                <Button> {item.quantity} </Button>
                                                                <Button id={item.id} disabled={item.quantity == 1}
                                                                    onClick={(event) => this.decreaseOrder(event, item.price)}>
                                                                    <Icon name='minus' /> Min
                                                                </Button>
                                                                <Button id={item.id} onClick={(event) => { this.deleteListCart(event) }}>
                                                                    <Icon name='trash alternate outline' />
                                                                </Button>
                                                            </Button.Group>
                                                        </div>
                                                    </center>
                                                </CardContent>
                                            </Card>
                                        )
                                    })}
                                </Card.Group>
                            </Segment>
                            <Segment> <Header as='h3'> Total : Rp. {this.state.grandTotal + (this.state.grandTotal * 0.1)} </Header>
                                <p>Total include tax 10%</p>
                                <Button onClick={(event) => { this.onCheckOut(event) }} primary animated='vertical' attached='top'>
                                    <Button.Content hidden>
                                        <Icon name='shop' />
                                    </Button.Content>
                                    <Button.Content visible>
                                        Check Out
                        </Button.Content>
                                </Button>
                                <Button color='red' animated='vertical' attached='bottom'>
                                    <a href='/order' style={{color:'white'}}>
                                    <Button.Content hidden>
                                        <Icon name='cancel' />
                                    </Button.Content>
                                    <Button.Content visible>
                                        Cancel
                                    </Button.Content>
                                    </a>
                                </Button>
                            </Segment>
                        </Segment.Group>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export default withRouter(Order)