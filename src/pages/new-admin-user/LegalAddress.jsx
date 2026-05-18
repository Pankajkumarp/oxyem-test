import Select from "react-select";
import { GoFileSubmodule } from "react-icons/go";

export default function LegalAddress({
    selectStyles,
    registeredCountry,
    setRegisteredCountry,
    registrationNumber,
    setRegistrationNumber,
    taxId,
    setTaxId,
    gstVatEin,
    setGstVatEin,
    pan,
    setPan,
    registeredAddress,
    setRegisteredAddress,
    stateProvince,
    setStateProvince,
    city,
    setCity,
    postalCode,
    setPostalCode,
    additionalAddress,
    setAdditionalAddress,
    sameAsRegistered,
    setSameAsRegistered,
    corporateAddress,
    setCorporateAddress,
    corporateState,
    setCorporateState,
    corporateCity,
    setCorporateCity,
    corporatePostalCode,
    setCorporatePostalCode,
    onBack,
    onNext
}) {
     const countryOptions = [
        { value: "India", label: "India" },
        { value: "USA", label: "USA" },
        { value: "UK", label: "UK" },
        { value: "Canada", label: "Canada" },
        { value: "Other", label: "Other" },
    ];
    return (
        <div className="card flex-fill comman-shadow oxyem-index">
            <div className="center-part">
                <div className="card-body">
                    <div className="col-12 mx-auto card border" id="sk-create-page">

                        <div className="group-description-text mb-4">
                            <GoFileSubmodule />
                            <div className="core-text">
                                <h3>Legal & Address Information</h3>
                                <p>Where is the company legally registered?</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-3">
                                <div className="mb-3">
                                    <label className="form-label">
                                        Where is the company registered? <span className='error'>*</span>
                                    </label>
                                    <Select
                                        options={countryOptions}
                                        value={countryOptions.find(opt => opt.value === registeredCountry)}
                                        onChange={(selected) => setRegisteredCountry(selected?.value)}
                                        placeholder="Select country"
                                        isClearable
                                        classNamePrefix="react-select"
                                        styles={selectStyles}
                                    />
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div className="mb-3">
                                    <label className="form-label">Registration Number / CIN <span className='error'>*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={registrationNumber}
                                        onChange={(e) => setRegistrationNumber(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="mb-3">
                                    <label className="form-label">Tax Identification Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={taxId}
                                        onChange={(e) => setTaxId(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div className="mb-3">
                                    <label className="form-label">
                                        {registeredCountry === "India"
                                            ? "GST Number"
                                            : registeredCountry === "USA"
                                                ? "EIN"
                                                : "VAT Number"}
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={gstVatEin}
                                        onChange={(e) => setGstVatEin(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                {registeredCountry === "India" && (
                                    <div className="mb-3">
                                        <label className="form-label">PAN</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={pan}
                                            onChange={(e) => setPan(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <div className="mb-3">
                                    <label className="form-label">Registered Address <span className='error'>*</span></label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={registeredAddress}
                                        onChange={(e) => setRegisteredAddress(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-3 mb-3">
                                <label className="form-label">State / Province <span className='error'>*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={stateProvince}
                                    onChange={(e) => setStateProvince(e.target.value)}
                                />
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-label">City <span className='error'>*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Postal / ZIP Code <span className='error'>*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                />
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-label">Additional Address (Optional)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={additionalAddress}
                                    onChange={(e) => setAdditionalAddress(e.target.value)}
                                />
                            </div>
                        </div>

                        <hr />

                        {/* Corporate Address */}
                        <div className="form-check mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={sameAsRegistered}
                                onChange={(e) => setSameAsRegistered(e.target.checked)}
                            />
                            <label className="form-check-label">
                                Corporate / Head Office Address same as Registered Address
                            </label>
                        </div>

                        {!sameAsRegistered && (
                            <>
                                <div className="mb-3">
                                    <label className="form-label">Corporate Address</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={corporateAddress}
                                        onChange={(e) => setCorporateAddress(e.target.value)}
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <input
                                            className="form-control"
                                            placeholder="State"
                                            value={corporateState}
                                            onChange={(e) => setCorporateState(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <input
                                            className="form-control"
                                            placeholder="City"
                                            value={corporateCity}
                                            onChange={(e) => setCorporateCity(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <input
                                            className="form-control"
                                            placeholder="Postal Code"
                                            value={corporatePostalCode}
                                            onChange={(e) => setCorporatePostalCode(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Navigation */}
                        <div className="d-flex justify-content-between mt-4">
                            <button
                                className="btn btn-secondary"
                                onClick={() => onBack("companyInfo")}
                            >
                                Back
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => onNext("assignModule")}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
