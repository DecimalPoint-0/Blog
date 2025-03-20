import React, { useEffect, useState } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link } from "react-router-dom";
import apiInstance from "../../utils/axios";
import useUserData from "../../plugin/useUserData";
import Moment from "../../plugin/Moment";
import Toast from "../../plugin/Toast";


function Profile() {

    const user_id = useUserData()?.user_id
    const [profile, setProfile] = useState({
        image: "",
        bio: "",
        author: "",
        facebook: "",
        twitter: "",
        instagram: ""
    })

    const [imagePreview, setImagePreview] = useState('')
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (event) => {
        const selectedfile = event.target.files[0];
        
        setProfile({
            ...profile,
            [event.target.name]: selectedfile
        })
        
        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result)
        }
        if(selectedfile) {
            reader.readAsDataURL(selectedfile)
        }

    }

    const handleChange = (event) => {
        setProfile({
            ...profile,
            [event.target.name]: event.target.value,
        });
    }

    const fetchProfile = async () => {
        try {
            const response = await apiInstance.get(`user/profile/${user_id}`)
            console.log(response.data)
            setProfile(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleUpdateData = async (event) => {
        event.preventDefault();
        setIsLoading(true)

        const formData = new FormData()

        formData.append("image", profile.image)

        formData.append("full_name", profile.full_name)
        formData.append("facebook", profile.facebook)
        formData.append("twitter", profile.twitter)
        formData.append("instagram", profile.instagram)
        formData.append("bio", profile.bio)

        try {
            const response = await apiInstance.patch(`user/profile/${user_id}/`,  formData,
                { headers: { "Content-Type": "multipart/form-data"}}
            )
            Toast('success', "profile Updated Successfully")
            setIsLoading(false)

        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() =>{
        fetchProfile()
    }, [])

    return (
        <>
            <Header />
            <section className="pt-5 pb-5">
                <div className="container">
                    <div className="row mt-0 mt-md-4">
                        <div className="col-lg-12 col-md-8 col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="mb-0">Profile Details</h3>
                                    <p className="mb-0">You have full control to manage your own account setting.</p>
                                </div>
                                <form className="card-body" onSubmit={handleUpdateData}>
                                    <div className="d-lg-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center mb-4 mb-lg-0">
                                            <img src={imagePreview || profile.image} id="img-uploaded" className="avatar-xl rounded-circle" alt="avatar" style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }} />
                                            <div className="ms-3">
                                                <h4 className="mb-0">Your avatar</h4>
                                                <p className="mb-0">PNG or JPG no bigger than 800px wide and tall.</p>
                                                <input onChange={handleFileChange} name="image" type="file" className="form-control mt-3" id="" />
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="my-5" />
                                    <div>
                                        <h4 className="mb-0 fw-bold">
                                            <i className="fas fa-user-gear me-2"></i>Personal Details
                                        </h4>
                                        <p className="mb-4 mt-2">Edit your personal information and address.</p>
                                        <div className="row gx-3">
                                            <div className="mb-3 col-12 col-md-12">
                                                <label className="form-label" htmlFor="fname">
                                                    Full Name
                                                </label>
                                                <input type="text" id="fname" name="full_name" onChange={handleChange} value={profile.full_name} className="form-control" placeholder="What's your full name?" required="" />
                                                <div className="invalid-feedback">Please enter first name.</div>
                                            </div>
                                            <div className="mb-3 col-12 col-md-12">
                                                <label className="form-label" htmlFor="fname">
                                                    Bio
                                                </label>
                                                <input type="text" onChange={handleChange} id="fname" name="bio" value={profile.bio} className="form-control" placeholder="Write a catchy bio!" required="" />
                                                <div className="invalid-feedback">Please bio data.</div>
                                            </div>

                                            <div className="mb-3 col-12 col-md-12">
                                                <label className="form-label" htmlFor="editFacebook">
                                                    Facebook
                                                </label>
                                                <input type="text" id="country" name="facebook" onChange={handleChange} value={profile.facebook} className="form-control" placeholder="What is your facebook handle?" required="" />
                                                <div className="invalid-feedback">Please enter Facebook.</div>
                                            </div>

                                            <div className="mb-3 col-12 col-md-12">
                                                <label className="form-label" htmlFor="editTwitter">
                                                    Twitter
                                                </label>
                                                <input type="text" id="country" name="twitter" onChange={handleChange} value={profile.twitter} className="form-control" placeholder="What is your twitter handle?" required="" />
                                                <div className="invalid-feedback">Please enter Twitter handle?.</div>
                                            </div>

                                            <div className="mb-3 col-12 col-md-12">
                                                <label className="form-label" htmlFor="editinstagram">
                                                    Instagram
                                                </label>
                                                <input type="text" id="country" name="instagram" onChange={handleChange} value={profile.instagram} className="form-control" placeholder="What is your instagram handle?" required="" />
                                                <div className="invalid-feedback">Please enter Instagram handle?.</div>
                                            </div>

                                            <div className="col-12 mt-4">
                                                <button className="btn btn-primary" type="submit">
                                                    Update Profile <i className="fas fa-check-circle"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default Profile;
