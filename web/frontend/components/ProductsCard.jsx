import { useEffect, useState } from "react";
import {
  Card,
  Heading,
  TextContainer,
  DisplayText,
  TextStyle,
} from "@shopify/polaris";
import { Toast, useNavigate } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import axios from "axios";

export function ProductsCard() {
  const emptyToastProps = { content: null };
  const [isLoading, setIsLoading] = useState(false);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const fetch = useAuthenticatedFetch();
  const [product,setProduct]=useState([])
  const userId =localStorage.getItem("userId")
  const navigate=useNavigate()
  useEffect(() => {
    async function fetchData() {
      // You can await here
      const {data}=await axios.get("http://localhost:5000/product/getproducts/1")
      setProduct(data)
      console.log(data);
      // ...
    }
 if(userId!==""){
  fetchData();
 }else{
     navigate("https://dropspot.in/signin")
 }
  }, []); // Or [] if effect doesn't need props or state

  const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: "/api/products/count",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

  const toastMarkup = toastProps.content && !isRefetchingCount && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  const handlePopulate = async () => {
   
    alert()

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: product })
  };
    const response = await fetch("/api/products/create",requestOptions);
 
    console.log(response);
    if (response.ok) {
      await refetchProductCount();

      setToastProps({ content: "products created!" });
    } else {
      setIsLoading(false);
      setToastProps({
        content: "There was an error creating products",
        error: true,
      });
    }
  };
  // const handleAdd=(data)=>{
  //   console.log("data",data)
  // }
  return (
    <>
      {toastMarkup}
      <Card
       style={{color:"red"}}
        title="LIST PRODUCT"
        sectioned
        primaryFooterAction={{
          content: "Add  products",
          onAction: handlePopulate,
          loading:isLoading 
        }}
      >
        <TextContainer spacing="loose">
          <p>
            Sample products are created with a default title and price from Dropspot. You can
            remove them at any time   .
          </p>
          <Heading element="h4">
            TOTAL PRODUCTS
            <DisplayText size="medium">
              <TextStyle variation="strong">
                {isLoadingCount ? "-" : data.count}
              </TextStyle>
            </DisplayText>
          </Heading>
        </TextContainer>
        <hr />
        <table border="1" style={{backgroundColor:"",borderColor:"red",marginTop:"30px"}}>
              <tr style={{color:"black"}}>
                <th>SELECT</th>
                
                <th >NAME</th>
                <th>SKU ID</th>

                <th>ACTIONS</th>
              </tr>
        {product &&
            product.length > 0 &&
            product.map((ele) => (
              
              <tr>
                <td><input type="checkbox" name="" id="" /></td>
              <td  style={{color:"red"}}>{ele.name}</td>
              <td  style={{color:"blue"}}>{ele._id}</td>
              <td><button  style={{color:"green"}}>LIST</button></td>
            </tr>
             
             
            
           
               ))}
               </table>
      </Card>
    </>
  );
}
