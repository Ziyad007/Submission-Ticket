import React from "react";
import { Footer } from "react-daisyui";

function Foot() {
  return (
    <Footer className="p-10 bg-base-100 text-neutral-content rounded-lg">
      <div>
        <h3 className="text-xl font-bold">Services</h3>
        <button className="link link-hover">Branding</button>
        <button className="link link-hover">Design</button>
        <button className="link link-hover">Marketing</button>
        <button className="link link-hover">Advertisement</button>
      </div>
      <div>
        <h3 className="text-xl font-bold">Company</h3>
        <button className="link link-hover">About us</button>
        <button className="link link-hover">Contact</button>
        <button className="link link-hover">Jobs</button>
        <button className="link link-hover">Press kit</button>
      </div>
      <div>
        <h3 className="text-xl font-bold">Legal</h3>
        <button className="link link-hover">Terms of use</button>
        <button className="link link-hover">Privacy policy</button>
        <button className="link link-hover">Cookie policy</button>
      </div>
    </Footer>
  );
}

export default Foot;
