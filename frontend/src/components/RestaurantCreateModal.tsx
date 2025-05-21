"use client";

import { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Cuisine } from "@/types/enums";
import { toast } from "react-toastify";
import { FormState, OperatingHours, daysOfWeek } from "@/types/RestaurantForm";
import { useStore } from "@/stores/context";
import PhoneInput from "react-phone-input-2";
import { observer } from "mobx-react";
import { Instance } from "mobx-state-tree";
import RestaurantModel from "@/stores/models/RestaurantModel";
import { getChangedFields } from "@/utils/getChangedFields";
import { sanitizeFormData } from "@/utils/sanitize";

const cuisineOptions = Object.values(Cuisine);

const defaultOperatingHours: OperatingHours = daysOfWeek.reduce(
  (acc, day) => ({
    ...acc,
    [day]: { open: "09:00", close: "17:00" },
  }),
  {}
);

const initialFormState = {
  name: "",
  description: "",
  address: "",
  email: "",
  operating_hours: defaultOperatingHours,
  booking_duration: 60,
  tables_capacity: 10,
  cuisine: "",
  phone: "",
  inst_url: "",
  rating: 0,
  is_pet_friendly: false,
};

interface Props {
  show: boolean;
  onClose: () => void;
  restaurantToEdit?: Instance<typeof RestaurantModel>;
}

const RestaurantCreateModal: React.FC<Props> = ({
  show,
  onClose,
  restaurantToEdit,
}) => {
  const { restaurantStore } = useStore();
  const [form, setForm] = useState<FormState>(initialFormState);

  useEffect(() => {
    if (restaurantToEdit) {
      setForm({
        ...restaurantToEdit,
        rating: Number(restaurantToEdit.rating),
        operating_hours: Object.fromEntries(
          Object.entries(restaurantToEdit.operating_hours).map(
            ([day, hours]) => {
              const [open, close] = String(hours).split(" - ");
              return [day, { open, close }];
            }
          )
        ),
      });
    } else {
      setForm(initialFormState);
    }
  }, [restaurantToEdit]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setForm({ ...form, [name]: newValue });
  };

  const handleHoursChange = (
    day: string,
    field: "open" | "close",
    value: string
  ) => {
    const morningValue = field === "open" && value;
    if (
      new Date(`1970-01-01T${morningValue}`) >=
      new Date(`1970-01-01T${form.operating_hours[day].close}`)
    ) {
      toast.error("Opening time must be before closing time");
      return;
    }

    setForm((prev) => ({
      ...prev,
      operating_hours: {
        ...prev.operating_hours,
        [day]: {
          ...prev.operating_hours[day],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentData = sanitizeFormData(form);

    try {
      if (restaurantToEdit) {
        const changedFields = getChangedFields(restaurantToEdit, currentData);

        if (Object.keys(changedFields).length === 0) {
          toast.info("No changes detected.");
          return;
        }

        await restaurantStore.updateRestaurant(
          restaurantToEdit?.id as number,
          changedFields
        );
        toast.success("Restaurant updated!");
      } else {
        await restaurantStore.createRestaurant(currentData);
        toast.success("Restaurant created!");
      }

      onClose();
      setForm(initialFormState);
      await restaurantStore.fetchRestaurants();
    } catch (error) {
      console.error(error);
      toast.error("Error saving restaurant.");
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        onClose();
        setForm(initialFormState);
      }}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {restaurantToEdit ? "Edit Restaurant" : "Add New Restaurant"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description ({form.description.length}/300)</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
              style={{ resize: "none" }}
              maxLength={300}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              name="address"
              placeholder="38 London Road, Glasgow"
              value={form.address}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <PhoneInput
              country={"ua"}
              value={form.phone}
              onChange={(val) =>
                setForm((prev) => ({
                  ...prev,
                  phone: val,
                }))
              }
              inputProps={{
                name: "phone",
                required: true,
              }}
              inputStyle={{
                height: "48px",
                width: "100%",
                fontSize: "14px",
              }}
              containerStyle={{ width: "100%" }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Instagram URL</Form.Label>
            <Form.Control
              type="url"
              name="inst_url"
              value={form.inst_url}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Booking Duration (minutes)</Form.Label>
            <Form.Control
              type="number"
              name="booking_duration"
              value={form.booking_duration}
              onChange={handleChange}
              min={30}
              step="30"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tables Capacity</Form.Label>
            <Form.Control
              type="number"
              name="tables_capacity"
              value={form.tables_capacity}
              onChange={handleChange}
              min={1}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Rating (0–5)</Form.Label>
            <Form.Control
              type="number"
              name="rating"
              value={form.rating}
              onChange={handleChange}
              min={0}
              max={5}
              step="0.1"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cuisine</Form.Label>
            <Form.Select
              name="cuisine"
              value={form.cuisine}
              onChange={handleChange}
              required
            >
              <option value="">Select cuisine</option>
              {cuisineOptions.map((cuisine) => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              name="is_pet_friendly"
              checked={form.is_pet_friendly}
              onChange={handleChange}
              label="Pet Friendly"
            />
          </Form.Group>

          <h5 className="mt-4 mb-2">Operating Hours</h5>
          {daysOfWeek.map((day) => (
            <Row key={day} className="align-items-center mb-2">
              <Col xs={4}>
                <strong>{day}</strong>
              </Col>
              <Col>
                <Form.Control
                  type="time"
                  value={form.operating_hours[day]?.open}
                  onChange={(e) =>
                    handleHoursChange(day, "open", e.target.value)
                  }
                  required
                />
              </Col>
              <Col>
                <Form.Control
                  type="time"
                  value={form.operating_hours[day]?.close}
                  onChange={(e) =>
                    handleHoursChange(day, "close", e.target.value)
                  }
                  required
                />
              </Col>
            </Row>
          ))}

          <div className="mt-4 text-end">
            <Button variant="secondary" onClick={onClose} className="me-2">
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {restaurantToEdit ? "Update Restaurant" : "Create Restaurant"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default observer(RestaurantCreateModal);
