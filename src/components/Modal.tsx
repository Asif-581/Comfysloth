// import * as React from "react";
// import Button from "@mui/material/Button";
// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
// import DialogTitle from "@mui/material/DialogTitle";
// import { useAppDispatch, useAppSelector } from "../Store/hooks";

// import { formatPrice, getCurrentLoggedInUser } from "../utils/helper";
// import { OrderDetails } from "../Types/type";
// import { useNavigate } from "react-router-dom";
// import api from "../../AxiosInterceptor";
// declare var Razorpay: any;
// interface FormValues {
//   fullName: string;
//   address: string;
//   pincode: string;
//   mobileNumber: string;
// }

// const initialFormValues: FormValues = {
//   fullName: "",
//   address: "",
//   pincode: "",
//   mobileNumber: "",
// };

// export default function Modal() {
//   const [open, setOpen] = React.useState(false);
//   const { cart, totalPrice } = useAppSelector((store) => store.cart);
//   const [
//     {
//       id,
//       products: { name, product_id },
//     },
//   ] = cart;
//   const cartIds = cart.map((item) => item.id);
//   const productIds = cart.map((product) => product.product_id);
  
//   const user = getCurrentLoggedInUser();
//   const dispatch = useAppDispatch();
//   const [formValues, setFormValues] = React.useState<FormValues>({
//     fullName: "",
//     address: "",
//     pincode: "",
//     mobileNumber: "",
//   });
//   const [errors, setErrors] = React.useState<Partial<FormValues>>({});

//   const navigate = useNavigate();

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormValues({ ...formValues, [name]: value });
//   };

//   const validate = () => {
//     const newErrors: Partial<FormValues> = {};

//     if (!formValues.fullName.trim()) {
//       newErrors.fullName = "Full Name is required";
//     }

//     if (!formValues.address.trim()) {
//       newErrors.address = "Address is required";
//     }

//     if (!formValues.pincode.trim()) {
//       newErrors.pincode = "Pincode is required";
//     }

//     if (!formValues.mobileNumber.trim()) {
//       newErrors.mobileNumber = "Mobile Number is required";
//     } else if (!/^\d{10}$/.test(formValues.mobileNumber.trim())) {
//       newErrors.mobileNumber = "Mobile Number should be 10 digits";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleOrderNow = async () => {
//     const isValid = validate();

//     if (isValid) {
//       const areAllFieldsEmpty = Object.values(formValues).every(
//         (value) => value.trim() === ""
//       );

//       if (!areAllFieldsEmpty) {
//         setFormValues({
//           fullName: "",
//           address: "",
//           pincode: "",
//           mobileNumber: "",
//         }); // Reset form fields to empty strings
//       }

//       var options = {
//         key: "rzp_test_fSv9aJfYVMdOmU",
//         key_secret: "vJDtGiufL80cFovi7kyZQcBg",
//         amount: totalPrice,
//         currency: "INR",
//         order_receipt: "order_rcptid_" + name,
//         name: "comfySloth",
//         description: "for testing purpose",
//         handler: async function (response) {
        

//           console.log(response);
//           const paymentId = response.razorpay_payment_id;

//           // store in supabase
//           const orderInfo = {
//             address_info: formValues,
//             email: user.email,
//             user_id: user.id,
//             payment_id: paymentId,
//           };

//           try {
//             const orderResponse = await api.post("/rest/v1/orders", orderInfo);
//             console.log(orderResponse);

//             if (
//               orderResponse &&
//               orderResponse.data &&
//               orderResponse.data.length > 0
//             ) {
//               const orderId = orderResponse.data[0].id;

//               const cartResponse = await api.patch(
//                 `/rest/v1/cart?user_id=eq.${user.id}&id=in.(${cartIds.join(
//                   ","
//                 )})`,
//                 {
//                   order_id: orderId,
//                 }
//               );

//               const productsStock = await api.get(`/rest/v1/products?id=in.(${productIds.join(',')})&select=stock`);
             
//               const updateStock = cart.map((product,index) => {
//                 const { quantity,product_id } = product;
//                 const productStock = productsStock.data[index];
//                 return {
//                   // id: product_id,
//                   stock: productStock.stock - quantity!
//                 };
//               })
 
//               await api.patch(
//                 `/rest/v1/products?id=in.(${productIds.join(",")})`,
//                 updateStock
//               );

//             } else {
//               console.log("No order data found");
//             }
//           } catch (error) {
//             console.log(error);
//           }
//           navigate("/order");
//             window.location.reload();
//         },
//       };

//       var rzp = new window.Razorpay(options);
//       rzp.open();
//     }

//     setOpen(false);
//   };

//   return (
//     <React.Fragment>
//       <Button variant="contained" color="success" onClick={handleClickOpen}>
//         Place order
//       </Button>
//       <Dialog
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title">ADD ADDRESS DETAILS</DialogTitle>
//         <DialogContent>
//           <DialogContentText id="alert-dialog-description">
//             <div>
//               <form
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: "20px",
//                   fontWeight: "bold",
//                 }}
//               >
//                 <div>
//                   <label htmlFor="fullName">Enter Full Name : </label>
//                   <input
//                     type="text"
//                     id="fullName"
//                     name="fullName"
//                     value={formValues.fullName}
//                     onChange={handleInputChange}
//                   />
//                   <br />
//                   {errors.fullName && (
//                     <span style={{ color: "red" }}>{errors.fullName}</span>
//                   )}
//                 </div>
//                 <div>
//                   <label htmlFor="address">Enter Full Address : </label>
//                   <textarea
//                     id="address"
//                     name="address"
//                     value={formValues.address}
//                     onChange={handleInputChange}
//                   />
//                   <br />
//                   {errors.address && (
//                     <span style={{ color: "red" }}>{errors.address}</span>
//                   )}
//                 </div>
//                 <div>
//                   <label htmlFor="pincode">Enter Pincode : </label>
//                   <input
//                     type="text"
//                     id="pincode"
//                     name="pincode"
//                     value={formValues.pincode}
//                     onChange={handleInputChange}
//                   />
//                   <br />
//                   {errors.pincode && (
//                     <span style={{ color: "red" }}>{errors.pincode}</span>
//                   )}
//                 </div>
//                 <div>
//                   <label htmlFor="mobileNumber">Enter Mobile Number : </label>
//                   <input
//                     type="text"
//                     id="mobileNumber"
//                     name="mobileNumber"
//                     value={formValues.mobileNumber}
//                     onChange={handleInputChange}
//                   />
//                   <br />
//                   {errors.mobileNumber && (
//                     <span style={{ color: "red" }}>{errors.mobileNumber}</span>
//                   )}
//                 </div>
//               </form>
//             </div>
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} variant="contained" size="small">
//             Cancel
//           </Button>
//           <Button
//             onClick={handleOrderNow}
//             variant="contained"
//             size="small"
//             autoFocus
//           >
//             Proceed
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </React.Fragment>
//   );
// }


import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";

import * as yup from "yup";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { TextField, Typography, Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../Store/hooks";

import { formatPrice, getCurrentLoggedInUser } from "../utils/helper";
import { OrderDetails } from "../Types/type";
import { useNavigate } from "react-router-dom";
import api from "../../AxiosInterceptor";
declare var Razorpay: any;

type FormValues = {
  fullName: string;
  address: string;
  pincode: string;
  mobileNumber: string;
}


const MyForm = () => {
  const [open, setOpen] = useState(false);
  const { cart, totalPrice } = useAppSelector((store) => store.cart);
  const [
    {
      id,
      products: { name, product_id },
    },
  ] = cart;
  const cartIds = cart.map((item) => item.id);
  const productIds = cart.map((product) => product.product_id);
  
  const user = getCurrentLoggedInUser();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // const handleOrderAsync = async () => {
  //   var options = {
  //       key: "rzp_test_fSv9aJfYVMdOmU",
  //       key_secret: "vJDtGiufL80cFovi7kyZQcBg",
  //       amount: totalPrice,
  //       currency: "INR",
  //       order_receipt: "order_rcptid_" + name,
  //       name: "comfySloth",
  //       description: "for testing purpose",
  //       handler: async function (response) {
        

  //         console.log(response);
  //         const paymentId = response.razorpay_payment_id;

  //         // store in supabase
  //         const orderInfo = {
  //           address_info: formValues,
  //           email: user.email,
  //           user_id: user.id,
  //           payment_id: paymentId,
  //         };

  //         try {
  //           const orderResponse = await api.post("/rest/v1/orders", orderInfo);
  //           console.log(orderResponse);

  //           if (
  //             orderResponse &&
  //             orderResponse.data &&
  //             orderResponse.data.length > 0
  //           ) {
  //             const orderId = orderResponse.data[0].id;

  //             const cartResponse = await api.patch(
  //               `/rest/v1/cart?user_id=eq.${user.id}&id=in.(${cartIds.join(
  //                 ","
  //               )})`,
  //               {
  //                 order_id: orderId,
  //               }
  //             );

  //             const productsStock = await api.get(`/rest/v1/products?id=in.(${productIds.join(',')})&select=stock`);
             
  //             const updateStock = cart.map((product,index) => {
  //               const { quantity,product_id } = product;
  //               const productStock = productsStock.data[index];
  //               return {
  //                 // id: product_id,
  //                 stock: productStock.stock - quantity!
  //               };
  //             })
 
  //             await api.patch(
  //               `/rest/v1/products?id=in.(${productIds.join(",")})`,
  //               updateStock
  //             );

  //           } else {
  //             console.log("No order data found");
  //           }
  //         } catch (error) {
  //           console.log(error);
  //         }
  //         navigate("/order");
  //           window.location.reload();
  //       },
  //     };

  //     var rzp = new window.Razorpay(options);
  //   rzp.open();
  //   setOpen(false);
  //   }

    
  

  const formik = useFormik({
    initialValues: {
      fullName: "",
      mobileNumber: "",
      pincode: "",
      address:'',
    },
    validationSchema: yup.object({
      fullName: yup
        .string()
        .max(15, "Must be 15 characters or less")
        .required("Fullname is required"),
      mobileNumber: yup
        .string()
        .matches(/^\d{10}$/, "Enter 10-digit Mobile Number")
        .required("Mobile number is Required"),
      pincode: yup
        .string()
        .matches(/^\d{6}$/, "Enter 6-digit Pincode")
        .required("Pincode is required"),
      address:yup.string().required('Enter your Address Details')
    }),
    onSubmit: (values) => {
    var options = {
      key: "rzp_test_fSv9aJfYVMdOmU",
      key_secret: "vJDtGiufL80cFovi7kyZQcBg",
      amount: totalPrice,
      currency: "INR",
      order_receipt: "order_rcptid_" + name,
      name: "comfySloth",
      description: "for testing purpose",
      handler: async function (response) {
        console.log(response);
        const paymentId = response.razorpay_payment_id;

        // store in supabase
        const orderInfo = {
          address_info: values,
          email: user.email,
          user_id: user.id,
          payment_id: paymentId,
        };

        try {
          const orderResponse = await api.post("/rest/v1/orders", orderInfo);
          console.log(orderResponse);

          if (
            orderResponse &&
            orderResponse.data &&
            orderResponse.data.length > 0
          ) {
            const orderId = orderResponse.data[0].id;

            const cartResponse = await api.patch(
              `/rest/v1/cart?user_id=eq.${user.id}&id=in.(${cartIds.join(
                ","
              )})`,
              {
                order_id: orderId,
              }
            );

            const productsStock = await api.get(
              `/rest/v1/products?id=in.(${productIds.join(",")})&select=stock`
            );

            const updateStock = cart.map((product, index) => {
              const { quantity, product_id } = product;
              const productStock = productsStock.data[index];
              return {
                // id: product_id,
                stock: productStock.stock - quantity!,
              };
            });

            await api.patch(
              `/rest/v1/products?id=in.(${productIds.join(",")})`,
              updateStock
            );
          } else {
            console.log("No order data found");
          }
        } catch (error) {
          console.log(error);
        }
        navigate("/order");
        window.location.reload();
      },
    };

    var rzp = new window.Razorpay(options);
      rzp.open();
       
    setOpen(false);
    },
  });

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleOpen}
        color="warning"
        disableRipple
      >
        Place Order
      </Button>
      <Dialog open={open}>
        <DialogTitle sx={{ display: "flex", gap: "1rem" }}>
          Enter Address Details
          <IconButton aria-label="close" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2} width="auto">
              <TextField
                id="fullName"
                name="fullName"
                label="Enter your Fullname"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.fullName}
                error={
                  formik.touched.fullName && Boolean(formik.errors.fullName)
                }
                helperText={formik.touched.fullName && formik.errors.fullName}
              />
              <TextField
                id="mobileNumber"
                name="mobileNumber"
                label="Enter your Mobile Number"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.mobileNumber}
                error={
                  formik.touched.mobileNumber &&
                  Boolean(formik.errors.mobileNumber)
                }
                helperText={
                  formik.touched.mobileNumber && formik.errors.mobileNumber
                }
              />
              <TextField
                id="pincode"
                name="pincode"
                label="Enter your Pincode"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.pincode}
                error={formik.touched.pincode && Boolean(formik.errors.pincode)}
                helperText={formik.touched.pincode && formik.errors.pincode}
              />

              <TextField
                id="address"
                name="address"
                label="Enter your Address"
                multiline
                rows={4}
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disableRipple
              >
                Proceed
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
              };

export default MyForm;






