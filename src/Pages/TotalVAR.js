import React from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useNavigate } from "react-router-dom";

const data = [{name: 'January', uv: 400, pv: 2400, amt: 1000}, {name: "February", uv: 400, pv: 1800, amt: 1000}];

function TotalVAR(){

    const navigate = useNavigate()

    return(
        <div>
            <div className="flex flex-col items-center justify-center w-full">
                <div className="w-9/10 md:w-auto flex flex-col md:max-w-mint-width py-6">
                    <div className="w-full flex px-6">
                        <div className="uppercase text-sm text-gray-600 hover:text-gray-500 cursor-pointer mb-4 flex-1" onClick={() => navigate("/")}>
                            ◀
                            <span className="text-xs"> Back to leader board</span>
                        </div>
                    </div>
                    <div className="mt-5 md:mt-0 md:min-w-mint-width md:max-w-mint-width px-6 pb-6 mb-5 rounded-lg custom-animations_shine__1YTqy  md:order-2 order-1">
                        <div className="general-styles_screen-centered-container__3fxeE h-full pt-2 pb-2">
                            <div className="border border:black rounded-lg">
                                <div className="px-1">
                                    <div className="general-styles_screen-centered-container__3fxeE h-full pt-2">
                                        <h1 className="text-center text-xl pt-2">
                                            📈 Yearly Approval Adjusted VaR (All protocols)
                                        </h1>
                                    </div>
                                </div>
                                <div className="px-1">
                                    <div className="general-styles_screen-centered-container__3fxeE h-full pt-2 pb-2">
                                        <LineChart width={500} height={300} data={data}>
                                            <XAxis dataKey="name"/>
                                            <YAxis/>
                                            <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
                                            <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                                            <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
                                        </LineChart>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default TotalVAR