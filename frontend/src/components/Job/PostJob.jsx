import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";

const PostJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [fixedSalary, setFixedSalary] = useState("");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [salaryType, setSalaryType] = useState("default");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [location, setLocation] = useState("");

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    axios.get("https://countriesnow.space/api/v0.1/countries")
      .then(response => {
        setCountries(response.data.data.map(country => country.country));
      })
      .catch(error => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);
    setState("");
    setCity("");

    axios.post("https://countriesnow.space/api/v0.1/countries/states", { country: selectedCountry })
      .then(response => {
        setStates(response.data.data.states);
      })
      .catch(error => {
        console.error("Error fetching states:", error);
      });

    setCities([]);
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setState(selectedState);

    axios.post("https://countriesnow.space/api/v0.1/countries/cities", { country, state: selectedState })
      .then(response => {
        setCities(response.data.data);
      })
      .catch(error => {
        console.error("Error fetching cities:", error);
      });
  };

  const handleJobPost = async (e) => {
    e.preventDefault();

    if (salaryType === "Fixed Salary") {
      setSalaryFrom("");
      setSalaryTo("");
    } else if (salaryType === "Ranged Salary") {
      setFixedSalary("");
    } else {
      setSalaryFrom("");
      setSalaryTo("");
      setFixedSalary("");
    }

    const jobData = {
      title,
      description,
      category,
      country,
      state,
      city,
      location,
      fixedSalary: fixedSalary.length >= 4 ? fixedSalary : undefined,
      salaryFrom: salaryFrom.length >= 4 ? salaryFrom : undefined,
      salaryTo: salaryTo.length >= 4 ? salaryTo : undefined,
    };

    try {
      const res = await axios.post("http://localhost:4000/api/v1/job/post", jobData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  if (!isAuthorized || (user && user.role !== "Employer")) {
    navigateTo("/");
    return null; 
  }

  return (
    <div className="job_post page">
      <div className="container">
        <h3>POST NEW JOB</h3>
        <form onSubmit={handleJobPost}>
          <div className="wrapper">
            <input
              type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Job Title"/>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}>
              <option value="">Select Category</option>
              <option value="Graphics & Design">Graphics & Design</option>
              <option value="Mobile App Development">Mobile App Development</option>
              <option value="Cloud Engineer">Cloud Engineer</option>
              <option value="Frontend Web Development">Frontend Web Development</option>
             <option value="MERN Stack Development">MERN STACK Development</option>
             <option value="Account & Finance">Account & Finance</option>
             <option value="Artificial Intelligence">Artificial Intelligence</option>
             <option value="Video Animation">Video Animation</option>             
             <option value="MEVN Stack Development">MEVN STACK Development</option>
             <option value="Data Entry Operator">Data Entry Operator</option>
            </select>
          </div>
          <div className="wrapper">
            <select value={country} onChange={handleCountryChange}>
              <option value="">Select Country</option>
              {countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <select value={state} onChange={handleStateChange} disabled={!country}>
              <option value="">Select State</option>
              {states.map((state, index) => (
                <option key={index} value={state.state_code}>
                  {state.name}
                </option>
              ))}
            </select>
            <select value={city} onChange={(e) => setCity(e.target.value)} disabled={!state}>
              <option value="">Select City</option>
              {cities.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
          />
          <div className="salary_wrapper">
            <select value={salaryType} onChange={(e) => setSalaryType(e.target.value)}>
              <option value="default">Select Salary Type</option>
              <option value="Fixed Salary">Fixed Salary</option>
              <option value="Ranged Salary">Ranged Salary</option>
            </select>
            <div>
              {salaryType === "default" ? (
                <p>Please provide Salary Type *</p>
              ) : salaryType === "Fixed Salary" ? (
                <input
                  type="number"
                  placeholder="Enter Fixed Salary"
                  value={fixedSalary}
                  onChange={(e) => setFixedSalary(e.target.value)}
                />
              ) : (
                <div className="ranged_salary">
                  <input
                    type="number"
                    placeholder="Salary From"
                    value={salaryFrom}
                    onChange={(e) => setSalaryFrom(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Salary To"
                    value={salaryTo}
                    onChange={(e) => setSalaryTo(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
          <textarea
            rows="10"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Job Description"
          />
          <button type="submit">Create Job</button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;

