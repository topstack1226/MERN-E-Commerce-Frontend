import './Productsimilar.css'
import React, { useEffect, useState, useContext, forwardRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
    Box,
    Button,
    Container,
    Tooltip,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Chip,
    Rating,
} from '@mui/material';
import Slide from '@mui/material/Slide';
import { MdAddShoppingCart } from 'react-icons/md'
import { AiFillCloseCircle, AiOutlineLogin } from 'react-icons/ai'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ContextFunction } from '../../Context/Context';
import ProductCard from '../../Components/Card/ProductCard';


const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ProductDetail = () => {
    const { cart, setCart } = useContext(ContextFunction)
    const [openAlert, setOpenAlert] = useState(false);
    const { id, cat } = useParams()
    const [product, setProduct] = useState([])
    const [similarProduct, setSimilarProduct] = useState([])


    let authToken = localStorage.getItem('Authorization')
    let setProceed = authToken ? true : false

    const getProduct = async () => {
        const { data } = await axios.get(`${process.env.REACT_APP_FETCH_PRODUCT}/${id}`)
        setProduct(data)
    }
    useEffect(() => {
        getProduct()
        getSimilarProducts()
        window.scroll(0, 0)
    }, [id])


    const addToCart = async (product) => {
        if (setProceed) {
            const { data } = await axios.post(`${process.env.REACT_APP_ADD_CART}`, product, {
                headers: {
                    'Authorization': authToken
                }
            })
            setCart(data)
            toast.success("Added To Cart", { autoClose: 500, })
            setCart([...cart, product])
            console.log(cart)
        }
        else {
            setOpenAlert(true);
        }
    }
    const getSimilarProducts = async () => {
        const { data } = await axios.post(`${process.env.REACT_APP_PRODUCT_TYPE}`, { userType: cat })
        setSimilarProduct(data)
    }

    const handleClose = () => {
        setOpenAlert(false);
    };
    let data = [];
    if (cat === 'shoe') {
        data.push(product.gender, product.brand, product.category)

    }
    else if (cat === 'book') {
        data.push(product.author, product.category)
    }
    else if (cat === 'cloths') {
        data.push(product.category)
    }
    else if (cat === 'electronics') {
        data.push(product.category)
    }
    return (
        <>
            <Container maxWidth='xl' sx={{ background: "", marginTop: 20 }}>
                <Dialog
                    open={openAlert}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    {/* <DialogTitle>{"Use Google's location service?"}</DialogTitle> */}
                    <DialogContent sx={{ width: { xs: 280, md: 350, xl: 400 } }}>
                        <DialogContentText id="alert-dialog-slide-description">
                            Please Login To Proceed 1111
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                        <Link to="/login"> <Button variant='contained' endIcon=<AiOutlineLogin /> color='primary'>Login</Button></Link>
                        <Button variant='contained' color='error' endIcon=<AiFillCloseCircle /> onClick={handleClose}>Close</Button>
                    </DialogActions>
                </Dialog>

                <main className='main-content'>
                    <div className="product-image">
                        <div className='detail-img-box'  >
                            <img alt={product.name} src={product.image} className='detail-img' />
                            <br />
                        </div>
                    </div>
                    <section className='product-details'>
                        <Typography variant='h4'>{product.name}</Typography>

                        <Typography >
                            {product.description}
                        </Typography>
                        <Typography >
                            <div className="chip">
                                {
                                    data.map(item => (
                                        <Chip label={item} variant="outlined" />
                                    ))
                                }
                            </div>
                        </Typography>
                        <Rating name="read-only" value={Math.round(product.rating)} readOnly />
                        <Tooltip title='Add To Cart'>
                            <Button variant='contained' className='all-btn' startIcon={<MdAddShoppingCart />} onClick={(() => addToCart(product))}>Buy</Button>
                        </Tooltip>
                    </section>
                </main>
                <Typography sx={{ marginTop: 10, marginBottom: 5 }}>Similar Products</Typography>
                <Box>
                    <Box className='similarProduct' sx={{ display: 'flex', overflowX: 'auto'}}>
                        {
                            similarProduct.map(prod => (
                                <Link to={`/Detail/type/${prod.type}/${prod._id}`} key={prod._id}>
                                    <ProductCard prod={prod} />
                                </Link>
                            ))
                        }
                    </Box>
                </Box>
                <ToastContainer />
            </Container >
        </>
    )
}

export default ProductDetail