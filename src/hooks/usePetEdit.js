import { useState, useEffect } from "react";

const formatDateForDB = (dateString) => {
  if (!dateString) return null;

  // Si ya está en formato YYYY-MM-DD, devolverlo
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }

  // Si es un objeto Date o string ISO, convertir
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch {
    return null;
  }
};

export function usePetEdit(selectedPet) {
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedBreed, setEditedBreed] = useState("");
  const [editedAge, setEditedAge] = useState("");
  const [editedWeight, setEditedWeight] = useState("");
  const [editedLastDeworming, setEditedLastDeworming] = useState("");
  const [editedNextDeworming, setEditedNextDeworming] = useState("");
  const [editedLastVaccine, setEditedLastVaccine] = useState("");
  const [editedNextVaccine, setEditedNextVaccine] = useState("");
  const [editedLastExam, setEditedLastExam] = useState("");
  const [editedLastRx, setEditedLastRx] = useState("");
  const [editedVeterinarian, setEditedVeterinarian] = useState("");
  const [editedClinic, setEditedClinic] = useState("");
  const [editedAllergies, setEditedAllergies] = useState("");
  const [editedFoodType, setEditedFoodType] = useState("");

  useEffect(() => {
    if (selectedPet) {
      setEditedName(selectedPet.name || "");
      setEditedBreed(selectedPet.breed || "");
      setEditedAge(selectedPet.age ? selectedPet.age.toString() : "");
      setEditedWeight(selectedPet.weight ? selectedPet.weight.toString() : "");
      setEditedLastDeworming(selectedPet.last_deworming || "");
      setEditedNextDeworming(selectedPet.next_deworming || "");
      setEditedLastVaccine(selectedPet.last_vaccine || "");
      setEditedNextVaccine(selectedPet.next_vaccine || "");
      setEditedLastExam(selectedPet.last_exam || "");
      setEditedLastRx(selectedPet.last_rx || "");
      setEditedVeterinarian(selectedPet.veterinarian || "");
      setEditedClinic(selectedPet.clinic || "");
      setEditedAllergies(selectedPet.allergies || "");
      setEditedFoodType(selectedPet.food_type || "");
    }
  }, [selectedPet]);

  const resetEditedValues = () => {
    if (selectedPet) {
      setEditedName(selectedPet.name || "");
      setEditedBreed(selectedPet.breed || "");
      setEditedAge(selectedPet.age ? selectedPet.age.toString() : "");
      setEditedWeight(selectedPet.weight ? selectedPet.weight.toString() : "");
      setEditedLastDeworming(selectedPet.last_deworming || "");
      setEditedNextDeworming(selectedPet.next_deworming || "");
      setEditedLastVaccine(selectedPet.last_vaccine || "");
      setEditedNextVaccine(selectedPet.next_vaccine || "");
      setEditedLastExam(selectedPet.last_exam || "");
      setEditedLastRx(selectedPet.last_rx || "");
      setEditedVeterinarian(selectedPet.veterinarian || "");
      setEditedClinic(selectedPet.clinic || "");
      setEditedAllergies(selectedPet.allergies || "");
      setEditedFoodType(selectedPet.food_type || "");
    }
  };

  const getEditedData = () => {
    const data = {
      id: selectedPet?.id,
      name: editedName.trim(),
      breed: editedBreed.trim() || null,
      age: editedAge ? parseInt(editedAge) : null,
      weight: editedWeight ? parseFloat(editedWeight) : null,
      last_deworming: formatDateForDB(editedLastDeworming),
      next_deworming: formatDateForDB(editedNextDeworming),
      last_vaccine: formatDateForDB(editedLastVaccine),
      next_vaccine: formatDateForDB(editedNextVaccine),
      last_exam: formatDateForDB(editedLastExam),
      last_rx: formatDateForDB(editedLastRx),
      veterinarian: editedVeterinarian.trim() || null,
      clinic: editedClinic.trim() || null,
      allergies: editedAllergies.trim() || null,
      food_type: editedFoodType.trim() || null,
    };

    console.log("Datos preparados para guardar:", data);
    return data;
  };

  return {
    editMode,
    setEditMode,
    editedName,
    setEditedName,
    editedBreed,
    setEditedBreed,
    editedAge,
    setEditedAge,
    editedWeight,
    setEditedWeight,
    editedLastDeworming,
    setEditedLastDeworming,
    editedNextDeworming,
    setEditedNextDeworming,
    editedLastVaccine,
    setEditedLastVaccine,
    editedNextVaccine,
    setEditedNextVaccine,
    editedLastExam,
    setEditedLastExam,
    editedLastRx,
    setEditedLastRx,
    editedVeterinarian,
    setEditedVeterinarian,
    editedClinic,
    setEditedClinic,
    editedAllergies,
    setEditedAllergies,
    editedFoodType,
    setEditedFoodType,
    resetEditedValues,
    getEditedData,
  };
}
