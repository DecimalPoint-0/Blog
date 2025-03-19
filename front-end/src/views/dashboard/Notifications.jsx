import React, { useState, useEffect } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link } from "react-router-dom";
import apiInstance from "../../utils/axios";
import useUserData from "../../plugin/useUserData";
import Moment from "../../plugin/Moment";
import Toast from "../../plugin/Toast";

function Notifications() {
    const [noti, setNoti] = useState([]);
    const user_id = useUserData()?.user_id

    const fetchNoti = async () => {
        const response = await apiInstance.get(`author/dashboard/notifications/${user_id}`);
        setNoti(response?.data)

    }

    const markNoti = async (e, noti_id) => {
        e.preventDefault()
        try {
            const response = await apiInstance.post(`author/dashboard/mark-notification/`, {
                noti_id: noti_id
            });
            console.log(response.data)
            Toast('success', 'notification marked as seen')
            fetchNoti()
        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        fetchNoti();
    }, []);

    return (
        <>
            <Header />
            <section className="pt-5 pb-5">
                <div className="container">
                    <div className="row mt-0 mt-md-4">
                        <div className="col-lg-12 col-md-8 col-12">
                            <div className="card mb-4">
                                <div className="card-header d-lg-flex align-items-center justify-content-between">
                                    <div className="mb-3 mb-lg-0">
                                        <h3 className="mb-0">Notifications</h3>
                                        <span>Manage all your notifications from here</span>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <ul className="list-group list-group-flush">
                                        {noti?.map((n, index) => (
                                            <li className="list-group-item p-4 shadow rounded-3 mt-4">
                                                <div className="d-flex">
                                                    <div className="ms-3 mt-2">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div>
                                                                <h4 className="mb-0 fw-bold">
                                                                    <i className="bi bi-chat-left-quote-fill text-success "></i> New {n.type}
                                                                </h4>
                                                                <p className="mt-3">
                                                                    {n?.user.username} {n.type} your post <b>{n?.post?.title}</b>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="mt-2">
                                                            <p className="mt-1">
                                                                <span className="me-2 fw-bold">
                                                                    Date: <span className="fw-light">{Moment(n.date)}</span>
                                                                </span>
                                                            </p>
                                                            <p>
                                                                <button onClick={(e) => markNoti(e, n.id)} class="btn btn-outline-secondary" type="button">
                                                                    Mark as Seen <i className="fas fa-check"></i>
                                                                </button>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default Notifications;
