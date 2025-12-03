import React, { useEffect } from 'react';
import { jsPDF } from 'jspdf';
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs';
import { useRouter } from 'next/router';
import { Tooltip } from 'react-tooltip';
import Select from '../../Components/common/SelectOption/SelectComponent';

export default function Index() {
    const router = useRouter();

    const columnData = [
        { label: 'Sr No', name: 'srno' },
        { label: 'Id', name: 'id' },
        { label: 'Product Name', name: 'productName' },
        { label: 'Product Code', name: 'productCode' },
        { label: 'Size', name: 'size' },
        { label: 'Properties', name: 'properties' },
        { label: 'Status', name: 'status' }
    ];

    const mockData = [
        [
            { name: 'srno', value: 1 },
            { name: 'id', value: '1234abc' },
            { name: 'productName', value: 'Product A' },
            { name: 'productCode', value: 'A1001' },
            { name: 'size', value: "7'" },
            { name: 'properties', value: '450W (New)' },
            { name: 'status', value: 'inactive' }
        ],
        [
            { name: 'srno', value: 2 },
            { name: 'id', value: '5678def' },
            { name: 'productName', value: 'Product B' },
            { name: 'productCode', value: 'B2002' },
            { name: 'size', value: "9'" },
            { name: 'properties', value: '1700W (Marble cutter)' },
            { name: 'status', value: 'active' }
        ]
    ];

    const generatePDF = (template) => {

        console.log(template);
        const doc = new jsPDF();
        const lineHeight = 10;
        let yOffset = 20;

        if (template === 1) {
            doc.setFontSize(16);
            doc.text('Inventory Report', 10, yOffset);
            yOffset += lineHeight;

            doc.setFontSize(12);
            doc.text('---------------------------------------------', 10, yOffset);
            yOffset += lineHeight;

            mockData.forEach((row, index) => {
                row.forEach((col) => {
                    doc.text(`${col.name}: ${col.value}`, 10, yOffset);
                    yOffset += lineHeight;
                });
                doc.text('---------------------------------------------', 10, yOffset);
                yOffset += lineHeight;
            });
        } else if (template === 2) {
            doc.setFontSize(18);
            doc.text('Inventory Overview', 10, yOffset);
            yOffset += lineHeight;

            doc.setFontSize(14);
            mockData.forEach((row, index) => {
                doc.text(`Product: ${row.find(col => col.name === 'productName').value}`, 10, yOffset);
                yOffset += lineHeight;

                doc.text(`Code: ${row.find(col => col.name === 'productCode').value}`, 10, yOffset);
                yOffset += lineHeight;

                doc.text(`Status: ${row.find(col => col.name === 'status').value}`, 10, yOffset);
                yOffset += lineHeight;

                doc.text('---------------------------------------------', 10, yOffset);
                yOffset += lineHeight;
            });
        } else if (template === 3) {
            doc.setFontSize(16);
            doc.text('Product Report', 10, yOffset);
            yOffset += lineHeight;

            mockData.forEach((row) => {
                row.forEach((col) => {
                    doc.text(`${col.name}: ${col.value}`, 10, yOffset);
                    yOffset += lineHeight;
                });
            });
        } else if (template === 4) {
            doc.setFontSize(20);
            doc.text('Inventory Detail', 10, yOffset);
            yOffset += lineHeight;

            mockData.forEach((row) => {
                doc.text(`Product: ${row.find(col => col.name === 'productName').value}`, 10, yOffset);
                yOffset += lineHeight;

                doc.text(`Properties: ${row.find(col => col.name === 'properties').value}`, 10, yOffset);
                yOffset += lineHeight;

                doc.text(`Size: ${row.find(col => col.name === 'size').value}`, 10, yOffset);
                yOffset += lineHeight;

                doc.text('---------------------------------------------', 10, yOffset);
                yOffset += lineHeight;
            });
        }

        doc.save('inventory-report.pdf');
    };

    // {
    //     "type": "Select",
    //     "name": "productName",
    //     "label": "Product Name",
    //     "placeholder": "Enter product name",
    //     "col": "4",
    //     "value": "",
    //     "options": [
    //       {
    //         "label": "Product Name 1",
    //         "value": "ProductName1"
    //       },
    //       {
    //         "label": "Product Name 2",
    //         "value": "ProductName2"
    //       }
    //     ],
    //     "validations": [
    //       {
    //         "type": "required",
    //         "message": "Select product"
    //       }
    //     ]
    //   },

   const options = [
          {
            "label": "Product Name",
            "value": "ProductName1"
          },
          {
            "label": "Size",
            "value": "Size"
          },
          {
            "label": "Type",
            "value": "Type"
          },
          {
            "label": "Status",
            "value": "Status"
          }
        ]
    useEffect(() => {
        const mainElement = document.querySelector('body');
        if (mainElement) {
            mainElement.setAttribute('id', 'stock-module');
        }
        return () => {
            if (mainElement) {
                mainElement.removeAttribute('id');
            }
        };
    }, []);
    return (
        <>
        
<div className="main-wrapper">
    <div className="page-wrapper">
        <div className="content container-fluid">
            <Breadcrumbs maintext="Report"  />
            <div className="row">
                <div className="col-12 col-lg-12 col-xl-12">
                    <div className="row">
                        <div className="col-12 col-lg-12 col-xl-12 d-flex">
                            <div className="card flex-fill comman-shadow oxyem-index">
                                <div className="center-part">
                                    <div className="card-body oxyem-mobile-card-body">
                                    <div className="row">
                        <div className="col-md-4">
                        <Select options={options} />
                        </div>
                    </div>

                                
                                        <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                        <div className="row">
                        <div className="col-12">
                            <div className="oxyem-stoke-template-grid">
                                <div
                                    className="oxyem-stoke-template-box oxyem-stoke-template1"
                                    onClick={() => generatePDF(1)}
                                >
                                    <span>Template 1</span>
                                </div>
                                <div
                                    className="oxyem-stoke-template-box oxyem-stoke-template2"
                                    onClick={() => generatePDF(2)}
                                >
                                    <span>Template 2</span>
                                </div>
                                <div
                                    className="oxyem-stoke-template-box oxyem-stoke-template3"
                                    onClick={() => generatePDF(3)}
                                >
                                    <span>Template 3</span>
                                </div>
                                <div
                                    className="oxyem-stoke-template-box oxyem-stoke-template4"
                                    onClick={() => generatePDF(4)}
                                >
                                    <span>Template 4</span>
                                </div>
                            </div>
                        </div>
                    </div>
                                        </div>

                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<Tooltip id="my-tooltip-breadcrumb" style={{ zIndex: 99999 }} />
</>
    );
}
