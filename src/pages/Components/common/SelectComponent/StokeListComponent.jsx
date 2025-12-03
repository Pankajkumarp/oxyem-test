import React, { useState } from 'react';
import SelectComponent from '../SelectOption/SelectComponent'; // Updated import

export default function CategoryComponent({ label, isDisabled, value, onChange }) {
    const [selectedProduct, setSelectedProduct] = useState(value?.product || null);
    const [selectedCategory, setSelectedCategory] = useState(value?.category || null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(value?.subcategory || null);

    const products = [
        {
            value: 'drill-machines',
            label: 'Drill Machines',
            categories: [
                {
                    value: 'cordless-drills',
                    label: 'Cordless Drills',
                    subcategories: ['Basic', 'Advanced']
                },
                {
                    value: 'hammer-drills',
                    label: 'Hammer Drills',
                    subcategories: ['Standard', 'Heavy Duty']
                }
            ]
        },
        {
            value: 'angle-grinders',
            label: 'Angle Grinders',
            categories: [
                {
                    value: 'small-angle-grinders',
                    label: 'Small Angle Grinders',
                    subcategories: ['100mm', '115mm']
                },
                {
                    value: 'large-angle-grinders',
                    label: 'Large Angle Grinders',
                    subcategories: ['180mm', '230mm']
                }
            ]
        }
    ];

    const handleProductChange = (selectedProduct) => {
        setSelectedProduct(selectedProduct);
        setSelectedCategory(null); // Reset category and subcategory when product changes
        setSelectedSubCategory(null);
        onChange({ product: selectedProduct, category: null, subcategory: null });
    };

    const handleCategoryChange = (selectedCategory) => {
        setSelectedCategory(selectedCategory);
        setSelectedSubCategory(null); // Reset subcategory when category changes
        onChange({ product: selectedProduct, category: selectedCategory, subcategory: null });
    };

    const handleSubCategoryChange = (selectedSubCategory) => {
        setSelectedSubCategory(selectedSubCategory);
        onChange({ product: selectedProduct, category: selectedCategory, subcategory: selectedSubCategory });
    };

    // Generate product options
    const productOptions = products.map(prod => ({ value: prod.value, label: prod.label }));
    console.log("Product Options:", productOptions); // Debugging log

    // Generate category options based on selected product
    const categoryOptions = selectedProduct
        ? products.find(prod => prod.value === selectedProduct.value)?.categories?.map(cat => ({ value: cat.value, label: cat.label })) || []
        : [];
    console.log("Category Options:", categoryOptions); // Debugging log

    // Generate subcategory options based on selected category
    const subCategoryOptions = selectedCategory
        ? products.find(prod => prod.value === selectedProduct.value)
            ?.categories.find(cat => cat.value === selectedCategory.value)
            ?.subcategories.map(subcat => ({ value: subcat, label: subcat })) || []
        : [];
    console.log("Subcategory Options:", subCategoryOptions); // Debugging log

    return (
        <div>
            <div className="row">
                <div className="col-md-4 position-relative ">
                <label htmlFor="ProductName" className='mx-2'>Product Name</label>
                    <SelectComponent
                        options={productOptions}
                        // label="Product Name"
                        isDisabled={isDisabled}
                        value={selectedProduct}
                        onChange={handleProductChange}
                    />
                </div>
                <div className="col-md-4 position-relative ">
                    <label htmlFor="Category" className='mx-2'>Category</label>
                    <SelectComponent
                        options={categoryOptions}
                        // label="Category"
                        isDisabled={!selectedProduct || isDisabled}
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                    />
                </div>
                <div className="col-md-4 position-relative">
                <label htmlFor="Subcategory" className='mx-2'>Sub-category</label>
                    <SelectComponent
                        options={subCategoryOptions}
                        // label="Subcategory"
                        isDisabled={!selectedCategory || isDisabled}
                        value={selectedSubCategory}
                        onChange={handleSubCategoryChange}
                    />
                </div>
            </div>
        </div>
    );
}
