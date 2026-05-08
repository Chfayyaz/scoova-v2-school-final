"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { HeaderCardProps } from "../../data";
import CustomSelect from "./CustomSelect";
import { Country, State, City } from "country-state-city";

const schoolEditValidationSchema = Yup.object({
  schoolname: Yup.string()
    .required("School name is required")
    .min(2, "School name must be at least 2 characters"),
  locationCity: Yup.string().required("City is required"),
  locationState: Yup.string().required("State is required"),
  locationCountry: Yup.string().required("Country is required"),
  schoolType: Yup.string().required("School type is required"),
  foundedYear: Yup.number().required("Founded year is required"),
  principalName: Yup.string().required("Principal name is required"),
  bio: Yup.string(),
});

export type SchoolEditFormRef = {
  getFormData: () => { formData: HeaderCardProps; bio: string } | null;
  validateForm: () => Promise<boolean>;
};

type SchoolEditFormProps = {
  school: HeaderCardProps;
  initialBio: string;
};

function normalizeLocationToken(value: string): string {
  return value.trim().toLowerCase();
}

function buildFormDataFromValues(
  values: {
    schoolname: string;
    locationCity: string;
    locationState: string;
    locationCountry: string;
    schoolType: string;
    foundedYear: number;
    principalName: string;
    totalStudents: string;
    bio: string;
  },
  school: HeaderCardProps
): HeaderCardProps {
  const types = values.schoolType ? [values.schoolType] : [];
  const stats = school.stats.map((s) => {
    if (s.text === "Founded") return { ...s, year: values.foundedYear };
    if (s.text === "Principal") return { ...s, name: values.principalName };
    if (s.text === "Students") return { ...s, number: Number(values.totalStudents) || 0 };
    return s;
  });
  return {
    ...school,
    schoolname: values.schoolname,
    location: { city: values.locationCity, state: values.locationState, country: values.locationCountry },
    types,
    stats,
  };
}

const SchoolEditForm = forwardRef<SchoolEditFormRef, SchoolEditFormProps>(
  function SchoolEditForm({ school, initialBio }, ref) {
    const foundedYearStat = school.stats.find((s) => s.text === "Founded");
    const principalStat = school.stats.find((s) => s.text === "Principal");

    const formik = useFormik({
      enableReinitialize: true,
      initialValues: {
        schoolname: school.schoolname,
        locationCity: school.location.city,
        locationState: school.location.state ?? "",
        locationCountry: school.location.country,
        schoolType: school.types[0] || "",
        foundedYear: foundedYearStat?.year ?? new Date().getFullYear(),
        principalName: principalStat?.name ?? "",
        totalStudents: String(school.stats.find((s) => s.text === "Students")?.number ?? ""),
        bio: initialBio,
      },
      validationSchema: schoolEditValidationSchema,
      onSubmit: () => {},
    });

    useImperativeHandle(ref, () => ({
      getFormData: () => ({
        formData: buildFormDataFromValues(
          {
            ...formik.values,
            foundedYear: Number(formik.values.foundedYear),
          },
          school
        ),
        bio: formik.values.bio,
      }),
      validateForm: async () => {
        formik.setTouched({
          schoolname: true,
          locationCity: true,
          locationState: true,
          locationCountry: true,
          schoolType: true,
          foundedYear: true,
          principalName: true,
          bio: true,
        });
        const errors = await formik.validateForm();
        return Object.keys(errors).length === 0;
      },
    }), [formik, school, initialBio]);

    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i).map(
      (year) => ({ value: year, label: year.toString() })
    );
    const allSchoolTypeOptions = ["Private", "Public"];
    const schoolTypeOptions = allSchoolTypeOptions.map((type) => ({ value: type, label: type }));
    const allCountries = Country.getAllCountries();
    const locationCountryValue = normalizeLocationToken(formik.values.locationCountry);
    const selectedCountry =
      allCountries.find((country) => normalizeLocationToken(country.name) === locationCountryValue) ??
      allCountries.find((country) => normalizeLocationToken(country.isoCode) === locationCountryValue) ??
      allCountries.find((country) => {
        const countryName = normalizeLocationToken(country.name);
        return (
          countryName.includes(locationCountryValue) || locationCountryValue.includes(countryName)
        );
      }) ??
      null;
    const countryOptions = allCountries.map((country) => ({
      value: country.isoCode,
      label: country.name,
    }));
    const selectedCountryIso = selectedCountry?.isoCode ?? "";
    const stateOptions = (selectedCountryIso ? State.getStatesOfCountry(selectedCountryIso) : []).map((state) => ({
      value: state.isoCode,
      label: state.name,
    }));
    const selectedStateIso =
      (selectedCountryIso
        ? State.getStatesOfCountry(selectedCountryIso).find(
            (state) =>
              normalizeLocationToken(state.name) === normalizeLocationToken(formik.values.locationState) ||
              normalizeLocationToken(state.isoCode) === normalizeLocationToken(formik.values.locationState)
          )?.isoCode
        : "") ?? "";
    const rawCityOptions =
      selectedCountryIso && selectedStateIso
        ? (City.getCitiesOfState(selectedCountryIso, selectedStateIso) ?? [])
        : selectedCountryIso
          ? (City.getCitiesOfCountry(selectedCountryIso) ?? [])
          : [];
    const baseCityOptions = rawCityOptions.map((city) => ({
      value: city.name,
      label: city.name,
    }));
    const cityOptions =
      formik.values.locationCity &&
      !baseCityOptions.some(
        (option) => normalizeLocationToken(String(option.value)) === normalizeLocationToken(formik.values.locationCity)
      )
        ? [{ value: formik.values.locationCity, label: formik.values.locationCity }, ...baseCityOptions]
        : baseCityOptions;
    const effectiveStateOptions =
      formik.values.locationState &&
      selectedCountryIso &&
      !stateOptions.some(
        (option) =>
          normalizeLocationToken(String(option.label)) === normalizeLocationToken(formik.values.locationState)
      )
        ? [
            {
              value: formik.values.locationState,
              label: formik.values.locationState,
            },
            ...stateOptions,
          ]
        : stateOptions;

    const inputErrorClass = (field: keyof typeof formik.errors) =>
      formik.touched[field] && formik.errors[field]
        ? "border-red-500 focus:border-red-500"
        : "border-custom-gray/20";

    return (
      <div className="mt-6 sm:mt-8 border-b border-custom-gray/20 pb-8 sm:pb-10">
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          onSubmit={formik.handleSubmit}
        >
          <div className="flex flex-col">
            <label className="text-[16px] font-medium text-custom-gray/95 mb-2">School Name</label>
            <input
              name="schoolname"
              value={formik.values.schoolname}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full bg-custom-white py-2.5 rounded-lg px-3 outline-none focus:border-custom-teal text-custom-gray/95 ${inputErrorClass("schoolname")}`}
            />
            {formik.touched.schoolname && formik.errors.schoolname && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.schoolname}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-[16px] font-medium text-custom-gray/95 mb-2">Total Students</label>
            <input
              type="number"
              name="totalStudents"
              value={formik.values.totalStudents}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full bg-custom-white py-2.5 rounded-lg px-3 outline-none focus:border-custom-teal text-custom-gray/95 border-custom-gray/20"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[16px] font-medium text-custom-gray/95 mb-2">School Type</label>
            <CustomSelect
              value={formik.values.schoolType}
              options={schoolTypeOptions}
              onChange={(value) => formik.setFieldValue("schoolType", value as string)}
              placeholder="Select type"
              className="w-full bg-custom-white"
            />
            {formik.touched.schoolType && formik.errors.schoolType && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.schoolType}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-[16px] font-medium text-custom-gray/95 mb-2">Founded Year</label>
            <CustomSelect
              value={formik.values.foundedYear}
              options={yearOptions}
              onChange={(value) => formik.setFieldValue("foundedYear", value)}
              placeholder="Select year"
              className="w-full bg-custom-white"
            />
            {formik.touched.foundedYear && formik.errors.foundedYear && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.foundedYear}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-[16px] font-medium text-custom-gray/95 mb-2">Country</label>
            <CustomSelect
              value={selectedCountryIso}
              options={countryOptions}
              onChange={async (value) => {
                const countryIso = value as string;
                const country = allCountries.find((c) => c.isoCode === countryIso)?.name ?? "";
                const currentCity = formik.values.locationCity;
                const availableCities = countryIso ? (City.getCitiesOfCountry(countryIso) ?? []) : [];
                await formik.setFieldValue("locationCountry", country, true);
                await formik.setFieldValue("locationState", "", true);
                const hasCurrentCity = availableCities.some((c) => c.name === currentCity);
                await formik.setFieldValue("locationCity", hasCurrentCity ? currentCity : "", true);
                await formik.setFieldTouched("locationCountry", true, true);
                await formik.setFieldTouched("locationCity", true, true);
              }}
              placeholder="Select country"
              className="w-full bg-custom-white"
            />
            {formik.touched.locationCountry && formik.errors.locationCountry && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.locationCountry}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-[16px] font-medium text-custom-gray/95 mb-2">City</label>
            <CustomSelect
              value={formik.values.locationCity}
              options={cityOptions}
              onChange={async (value) => {
                const city = value as string;
                await formik.setFieldValue("locationCity", city, true);
                formik.setFieldError("locationCity", undefined);
                await formik.setFieldTouched("locationCity", true, true);
              }}
              placeholder={selectedCountryIso ? "Select city" : "Select country first"}
              className="w-full bg-custom-white"
              disabled={!selectedCountryIso}
            />
            {formik.touched.locationCity && formik.errors.locationCity && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.locationCity}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-[16px] font-medium text-custom-gray/95 mb-2">State</label>
            <CustomSelect
              value={selectedStateIso || formik.values.locationState}
              options={effectiveStateOptions}
              onChange={async (value) => {
                const stateIso = value as string;
                const stateName =
                  (selectedCountryIso
                    ? State.getStatesOfCountry(selectedCountryIso).find((s) => s.isoCode === stateIso)?.name
                    : "") ?? "";
                await formik.setFieldValue("locationState", stateName, true);
                const availableCities =
                  selectedCountryIso && stateIso
                    ? City.getCitiesOfState(selectedCountryIso, stateIso)
                    : [];
                const hasCurrentCity = availableCities.some((c) => c.name === formik.values.locationCity);
                if (!hasCurrentCity) {
                  await formik.setFieldValue("locationCity", "", true);
                }
                await formik.setFieldTouched("locationState", true, true);
              }}
              placeholder={selectedCountryIso ? "Select state" : "Select country first"}
              className="w-full bg-custom-white"
              disabled={!selectedCountryIso}
            />
            {formik.touched.locationState && formik.errors.locationState && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.locationState}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-[16px] font-medium text-custom-gray/95 mb-2">Principal Name</label>
            <input
              name="principalName"
              value={formik.values.principalName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full bg-custom-white py-2.5 rounded-lg px-3 outline-none focus:border-custom-teal text-custom-gray/95 ${inputErrorClass("principalName")}`}
            />
            {formik.touched.principalName && formik.errors.principalName && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.principalName}</p>
            )}
          </div>

          <div className="flex flex-col md:col-start-2">
            <label className="text-[16px] font-medium text-custom-gray/95 mb-2">School Bio</label>
            <textarea
              name="bio"
              value={formik.values.bio}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full hide-scrollbar text-sm bg-custom-white py-2.5 rounded-lg px-3 outline-none resize-none focus:border-custom-teal text-custom-gray/95 border-custom-gray/20"
              rows={6}
            />
          </div>
        </form>
      </div>
    );
  }
);

export default SchoolEditForm;
