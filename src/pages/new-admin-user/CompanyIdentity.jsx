import Select from "react-select";
import Files from "react-files";
import { FiUpload } from "react-icons/fi";
import { FaRegCheckCircle } from "react-icons/fa";
import { VscDiffRenamed } from "react-icons/vsc";

export default function CompanyIdentity({
  companyLegalName,
  setCompanyLegalName,
  brandName,
  setBrandName,
  incorporationYear,
  setIncorporationYear,
  website,
  setWebsite,
  companyDescription,
  setCompanyDescription,
  industry,
  setIndustry,
  companyType,
  setCompanyType,
  companyLogo,
  setCompanyLogo,
  selectStyles,
  onNext
}) {
    const industryOptions = [
        { value: "IT", label: "IT" },
        { value: "Manufacturing", label: "Manufacturing" },
        { value: "Finance", label: "Finance" },
        { value: "Healthcare", label: "Healthcare" },
        { value: "Education", label: "Education" },
    ];

    const companyTypeOptions = [
        { value: "Private Ltd", label: "Private Ltd" },
        { value: "Public Ltd", label: "Public Ltd" },
        { value: "LLP", label: "LLP" },
        { value: "Partnership", label: "Partnership" }
    ];

    return (
        <div className="card flex-fill comman-shadow oxyem-index">
            <div className="center-part">
                <div className="card-body">
                    <div
                        className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border"
                        id="sk-create-page"
                    >
                        <div className="group-description-text mb-4">
                            <VscDiffRenamed />
                            <div className="core-text">
                                <h3>Company Identity</h3>
                                <p>Tell us who the company is.</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-9">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label className="form-label">Company Legal Name <span className='error'>*</span></label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter legal company name"
                                                value={companyLegalName}
                                                onChange={(e) => setCompanyLegalName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label className="form-label">Brand / Display Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter brand name"
                                                value={brandName}
                                                onChange={(e) => setBrandName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label className="form-label">Year of Incorporation</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                min="1900"
                                                max={new Date().getFullYear()}
                                                maxLength={4}
                                                value={incorporationYear}
                                                onChange={(e) => {
                                                    let value = e.target.value.replace(/\D/g, "");

                                                    if (value.length === 4) {
                                                        const year = Number(value);
                                                        const currentYear = new Date().getFullYear();

                                                        if (year < 1900 || year > currentYear) {
                                                            return; // block invalid year
                                                        }
                                                    }

                                                    setIncorporationYear(value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label className="form-label">Industry Type <span className='error'>*</span></label>
                                            <Select
                                                options={industryOptions}
                                                value={industryOptions.find(opt => opt.value === industry)}
                                                onChange={(selected) => setIndustry(selected?.value)}
                                                placeholder="Select Industry"
                                                isClearable
                                                classNamePrefix="react-select"
                                                styles={selectStyles}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label className="form-label">Company Type <span className='error'>*</span></label>
                                            <Select
                                                options={companyTypeOptions}
                                                value={companyTypeOptions.find(opt => opt.value === companyType)}
                                                onChange={(selected) => setCompanyType(selected?.value)}
                                                placeholder="Select Company Type"
                                                isClearable
                                                classNamePrefix="react-select"
                                                styles={selectStyles}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label className="form-label">Company Website</label>
                                            <input
                                                type="url"
                                                className="form-control"
                                                placeholder="https://example.com"
                                                value={website}
                                                onChange={(e) => setWebsite(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="mb-3">
                                    <label className="form-label">Company Logo <span className='error'>*</span></label>
                                    <div className="files custom_file_field_b">
                                        <Files
                                            className="files-dropzone"
                                            onChange={(files) => setCompanyLogo(files[0])} // only first file
                                            accepts={['image/png', 'image/jpg', 'image/jpeg', 'image/webp']}
                                            multiple={false}
                                            maxFileSize={3000000} // 3MB
                                            clickable
                                        >
                                            <FiUpload />
                                            <span className="ms-2">
                                                Drag & Drop your logo or <span className="filepond--label-action">Browse</span>
                                            </span>

                                            {companyLogo && (
                                                <span className="fileupload-check">
                                                    <FaRegCheckCircle />
                                                </span>
                                            )}
                                        </Files>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <div className="mb-3">
                                    <label className="form-label">About Company</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        placeholder="Brief description of the company"
                                        value={companyDescription}
                                        onChange={(e) => setCompanyDescription(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="d-flex justify-content-end mt-2">
                            <button
                                className="btn btn-primary"
                                //disabled={!isCompanyIdentityDone}
                                onClick={() => onNext("legalAddress")}
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
