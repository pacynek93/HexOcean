import React, { useState } from "react";
import { Form, Container } from "semantic-ui-react";

const DishForm = () => {
  const [formValues, setFormValues] = useState({
    name: "",
    preparationTime: "",
    type: "",
    noOfSlices: "",
    diameter: "",
    spicinessScale: "",
    slicesOfBread: "",
  });

  const [preparationTimeError, setPreparationTimeError] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "preparationTime") {
      let formattedValue = value.replace(/[^0-9]/g, "").slice(0, 6);
      formattedValue = formattedValue
        .replace(/(\d{2})(\d)/, "$1:$2")
        .replace(/(\d{2})(\d)/, "$1:$2");

      const maxTime = "23:59:59";
      if (value > maxTime) {
        setPreparationTimeError("Preparation Time cannot exceed 23:59:59");
      } else {
        setPreparationTimeError("");
      }

      setFormValues((prevState) => ({
        ...prevState,
        [name]: formattedValue,
      }));
    } else if (name === "diameter") {
      let formattedValue = value.replace(/[^\d.]/g, "");
      formattedValue = formattedValue.replace(/(\d{2})(?=\d)/g, "$1.");

      setFormValues((prevState) => ({
        ...prevState,
        [name]: formattedValue,
      }));
    } else {
      setFormValues((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      name: formValues.name,
      preparation_time: formValues.preparationTime,
      type: formValues.type,
      no_of_slices:
        formValues.type === "pizza" ? formValues.noOfSlices : undefined,
      diameter: formValues.type === "pizza" ? formValues.diameter : undefined,
      spiciness_scale:
        formValues.type === "soup" ? formValues.spicinessScale : undefined,
      slices_of_bread:
        formValues.type === "sandwich" ? formValues.slicesOfBread : undefined,
    };

    try {
      const response = await fetch(
        "https://umzzcc503l.execute-api.us-west-2.amazonaws.com/dishes/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Form submitted successfully!");
      } else {
        console.error("Error:", data.message || response.statusText);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label htmlFor="name">Dish Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formValues.name}
            minLength={3}
            onChange={handleInputChange}
            required
          />
        </Form.Field>
        <Form.Field>
          <label htmlFor="preparationTime">Preparation Time:</label>
          <input
            type="text"
            id="preparationTime"
            name="preparationTime"
            value={formValues.preparationTime}
            onChange={handleInputChange}
            placeholder="00:00:00"
            pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
            required
          />
          {preparationTimeError && <span>{preparationTimeError}</span>}
        </Form.Field>
        <Form.Field>
          <label htmlFor="type">Dish Type:</label>
          <select
            id="type"
            name="type"
            value={formValues.type}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              Select a dish type
            </option>
            <option value="pizza">Pizza</option>
            <option value="soup">Soup</option>
            <option value="sandwich">Sandwich</option>
          </select>
        </Form.Field>

        {formValues.type === "pizza" && (
          <>
            <Form.Field>
              <label htmlFor="noOfSlices">Number of Slices:</label>
              <input
                type="number"
                id="noOfSlices"
                min="1"
                max="16"
                name="noOfSlices"
                value={formValues.noOfSlices}
                onChange={handleInputChange}
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                required
              />
            </Form.Field>
            <Form.Field>
              <label htmlFor="diameter">Diameter:</label>
              <input
                type="number"
                step="0.01"
                id="diameter"
                name="diameter"
                value={formValues.diameter}
                onChange={handleInputChange}
                required
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
              />
            </Form.Field>
          </>
        )}

        {formValues.type === "soup" && (
          <>
            <Form.Field>
              <label htmlFor="spicinessScale">Spiciness Scale (1-10):</label>
              <input
                type="number"
                min="1"
                max="10"
                id="spicinessScale"
                name="spicinessScale"
                value={formValues.spicinessScale}
                onChange={handleInputChange}
                required
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
              />
            </Form.Field>
          </>
        )}

        {formValues.type === "sandwich" && (
          <>
            <Form.Field>
              <label htmlFor="slicesOfBread">Slices of Bread:</label>
              <input
                type="number"
                id="slicesOfBread"
                name="slicesOfBread"
                value={formValues.slicesOfBread}
                onChange={handleInputChange}
                required
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
              />
            </Form.Field>
          </>
        )}

        <Form.Button type="submit">Submit</Form.Button>
      </Form>
    </Container>
  );
};

export default DishForm;
