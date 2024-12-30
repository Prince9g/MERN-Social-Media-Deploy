import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import React, { useEffect, useState } from 'react'
import { Button } from "./ui/button"
import axios from "axios"
import { toast } from "sonner"
import { Link, useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useSelector } from "react-redux"

const Signup = () => {
    const [input, setinput] = useState({
        username:"",
        email:"",
        password:""
    });
    const {user} = useSelector(store=>store.auth);
    const [loading, setloading] = useState(false);
    const navigate = useNavigate();
    const changeEventHandler = (e) => {
        setinput({...input, [e.target.name]: e.target.value});
    }
    const signupHandler = async (e) =>{
        e.preventDefault();
        try {
            setloading(true);
            const res = await axios.post('https://mern-social-media-deploy.onrender.com/api/v1/user/register', input, {
                headers:{
                'Content-Type' :'application/json'
                },
                withCredentials:true
            });
            if(res.data.success){
                navigate('/login');
                toast.success(res.data.message);
                setinput({
                    username:"",
                    email:"",
                    password:""
                });
            } 
        } catch (error) {
            console.log(error);
            setinput({
                username:"",
                email:"",
                password:""
            });
            toast.success(error.response.data.message);
        } finally{
            setloading(false);
        }
    }
        useEffect(()=>{
            if(user){
                navigate('/');
            }
        }, []);
  return (
    <div className="flex items-center w-screen h-screen justify-center">
        <form onSubmit={signupHandler} className="shadow-lg flex flex-col gap-5 p-8">
            <div className="my-4">
                <h1 className="text-center font-bold text-xl">LOGO</h1>
                <p className="text-sm text-center">SignUp to See What are People Doing!!</p>
            </div>
            <div>
                <Label>Username</Label>
                <Input type="text" 
                name="username"
                value={input.username}
                onChange={changeEventHandler}
                className="focus-visible:ring-transparent my-2"
                />
            </div>
            <div>
                <Label>Email</Label>
                <Input type="email" 
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                className="focus-visible:ring-transparent my-2"
                />
            </div>
            <div>
                <Label>Password</Label>
                <Input type="password" 
                name="password"
                value={input.password}
                onChange={changeEventHandler}
                className="focus-visible:ring-transparent my-2"
                />
            </div>
            {
                loading ? (
                    <Button>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                    </Button>
                ) : (
                    <Button type="submit">SignUp</Button>
                )
            }
            <span className="text-center">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></span>
        </form>
    </div>
  )
}

export default Signup
