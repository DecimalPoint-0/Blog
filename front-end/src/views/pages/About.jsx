import React, { useState, useEffect } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import apiInstance from "../../utils/axios";

function About() {

    const [team, setTeam] = useState([])

    const fetchTeam = async () => {
        try {
            const response = await apiInstance.get('team/')
            setTeam(response.data)
            console.log(team)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchTeam()
    }, [])

    return (
        <>
            <Header />

            <section className="pt-4 pb-0">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-9 mx-auto">
                            <h2>Our story</h2>
                            <p className="lead">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis possimus suscipit porro dignissimos quae hic doloribus deleniti voluptatibus in totam quasi quos omnis maiores, nam sint! In laborum architecto natus magnam sunt quasi neque aperiam, enim commodi totam
                                nam nostrum.
                            </p>
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur necessitatibus, sapiente facere harum molestiae, quas aperiam nulla eius, cupiditate deserunt accusantium magni! Necessitatibus saepe cupiditate facilis, sint est quod hic maxime aliquam, et impedit
                                optio nihil, magnam libero ipsa quia expedita possimus. Unde corrupti asperiores, facilis dolorum ea doloremque sunt suscipit cupiditate officiis deleniti neque fuga eos rerum nulla aperiam incidunt praesentium quae tenetur officia fugiat magnam architecto, maiores
                                est corporis. Autem possimus maiores nam hic tempora, impedit nemo a ad quidem? Voluptates, similique ut molestiae suscipit fugiat labore laudantium saepe incidunt facere. Vitae cupiditate ipsum et sed quia earum, consequatur atque quos dolore sunt beatae dolorum
                                harum error aperiam dolores a ab eveniet animi. Doloribus minus quod aperiam maiores ex nulla eius perferendis inventore libero, sint dolore incidunt cupiditate excepturi omnis id eaque sit nemo vitae, in dolor molestias velit! In, aliquam! Possimus eum blanditiis hic
                                enim illo quasi quod. Incidunt, esse? Molestiae optio sed quaerat minus, magnam eius accusamus odit nam nulla porro similique itaque sit, alias qui odio cupiditate totam laboriosam eos ratione minima. Amet sed alias nobis, soluta molestiae, suscipit possimus
                                doloremque quod omnis delectus velit dolore repudiandae et iure exercitationem odio quia quae temporibus minus!
                            </p>
                            <h3 className="mt-4">We do this across:</h3>
                            <ul>
                                <li>A pleasure exertion if believed provided to. All led out world this music while asked. Paid mind even sons does he door no. Attended overcame repeated it is perceived Marianne in.</li>
                                <li>Warrant private blushes removed an in equally totally if. Delivered dejection necessary objection do Mr prevailed. Mr feeling does chiefly cordial in do.</li>
                                <li>
                                    Mr feeling does chiefly cordial in do.{" "}
                                    <a href="#">
                                        <u>Water timed folly right aware if oh truth.</u>
                                    </a>{" "}
                                    Imprudence attachment him his for sympathize. Large above be to means.
                                </li>
                                <li>Dashwood does provide stronger is. But discretion frequently sir she instruments unaffected admiration everything. Meant balls it if up doubt small purse.</li>
                            </ul>
                            <h3 className="mb-3 mt-5">Our team</h3>
                            <div className="row g-4">
                                {team?.map((t, index) => (
                                    <div className="col-sm-6 col-lg-3">
                                        <div className="text-center">
                                            <div className="avatar avatar-xxl mb-2">
                                                <img
                                                    className="avatar-img rounded-circle"
                                                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                                    src={t?.image}
                                                    alt="avatar"
                                                />
                                            </div>
                                            <h5>{t.full_name}</h5>
                                            <p className="m-0">{t?.position}</p>
                                        </div>
                                    </div>
                                ))}
  
                            </div>
                            {/* Service START */}
                            <h3 className="mb-3 mt-5">What we do</h3>
                            <div className="row">
                                {/* Service item*/}
                                <div className="col-md-6 col-lg-4 mb-4">
                                    <img className="rounded" style={{ width: "100%", height: "170px", objectFit: "cover" }} src="https://www.aspistrategist.org.au/wp-content/uploads/2023/11/GettyImages-467714941-1024x764.jpg" alt="Card image" />
                                    <h4 className="mt-3">Global news services</h4>
                                    <p>Perceived end knowledge certainly day sweetness why cordially. Ask a quick six seven offer see among.</p>
                                </div>
                                {/* Service item*/}
                                <div className="col-md-6 col-lg-4 mb-4">
                                    <img className="rounded" style={{ width: "100%", height: "170px", objectFit: "cover" }} src="https://www.varletmachines.com/sites/default/files/styles/large/public/2022-04/Commercial.png?itok=jE81FZ_E" alt="Card image" />
                                    <h4 className="mt-3">Commercial services</h4>
                                    <p>Speedily say has suitable disposal add boy. On forth doubt miles of child. Exercise joy man children rejoiced.</p>
                                </div>
                                {/* Service item*/}
                                <div className="col-md-6 col-lg-4 mb-4">
                                    <img className="rounded" style={{ width: "100%", height: "170px", objectFit: "cover" }} src="https://www.columbiasouthern.edu/media/azmjow33/fire-ems-cj-public-service.jpg" alt="Card image" />
                                    <h4 className="mt-3">Public services</h4>
                                    <p> Yet uncommonly his ten who diminution astonished. Demesne new manners savings staying had. </p>
                                </div>
                            </div>
                            {/* Service END */}
                        </div>{" "}
                        {/* Col END */}
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default About;
