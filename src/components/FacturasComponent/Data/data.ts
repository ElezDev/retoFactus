import arrozImage from '../../../assets/images/arroz.webp';
import frijolesImage from '../../../assets/images/frijoles.webp';
import aceiteImage from '../../../assets/images/aceite.png';
import papaImage from '../../../assets/images/papa.jpeg';
import polloImage from '../../../assets/images/pollo.jpeg';
import lentejasImage  from '../../../assets/images/lentejas.webp';
import salImage  from '../../../assets/images/sal.webp';
import huevosImage from '../../../assets/images/huevos.jpg';





export const productsData = [
    {
      id: 1,
      code_reference: "12345",
      name: "Arroz",
      price: 2500,
      tax_rate: "19.00",
      discount_rate: 10,
      unit_measure_id: 70,
      standard_code_id: 1,
      is_excluded: 0,
      tribute_id: 1,
      withholding_taxes: [{ code: "06", withholding_tax_rate: "7.00" }],
      image: arrozImage,
    },
    {
      id: 2,
      code_reference: "54321",
      name: "Frijoles",
      price: 3000,
      tax_rate: "5.00",
      discount_rate: 0,
      unit_measure_id: 70,
      standard_code_id: 1,
      is_excluded: 0,
      tribute_id: 1,
      withholding_taxes: [],
      image: frijolesImage,
    },
    {
      id: 3,
      code_reference: "67890",
      name: "Aceite",
      price: 8000,
      tax_rate: "19.00",
      discount_rate: 5,
      unit_measure_id: 70,
      standard_code_id: 1,
      is_excluded: 0,
      tribute_id: 1,
      withholding_taxes: [{ code: "05", withholding_tax_rate: "15.00" }],
      image: aceiteImage,
    },
    {
        id: 4,
        code_reference: "67890",
        name: "Papa",
        price: 8000,
        tax_rate: "1.000",
        discount_rate: 5,
        unit_measure_id: 70,
        standard_code_id: 1,
        is_excluded: 0,
        tribute_id: 1,
        withholding_taxes: [{ code: "05", withholding_tax_rate: "15.00" }],
        image: papaImage,
      },
      {
        id: 5,
        code_reference: "67890",
        name: "Pollo",
        price: 8000,
        tax_rate: "19.00",
        discount_rate: 5,
        unit_measure_id: 70,
        standard_code_id: 1,
        is_excluded: 0,
        tribute_id: 1,
        withholding_taxes: [{ code: "05", withholding_tax_rate: "15.00" }],
        image: polloImage,
      },

      {
        id: 6,
        code_reference: "67890",
        name: "Huevos",
        price: 8000,
        tax_rate: "19.00",
        discount_rate: 5,
        unit_measure_id: 70,
        standard_code_id: 1,
        is_excluded: 0,
        tribute_id: 1,
        withholding_taxes: [{ code: "05", withholding_tax_rate: "15.00" }],
        image: huevosImage,
      },
      {
        id: 7,
        code_reference: "67890",
        name: "Lentejas",
        price: 8000,
        tax_rate: "19.00",
        discount_rate: 5,
        unit_measure_id: 70,
        standard_code_id: 1,
        is_excluded: 0,
        tribute_id: 1,
        withholding_taxes: [{ code: "05", withholding_tax_rate: "15.00" }],
        image: lentejasImage,
      },


      {
        id: 8,
        code_reference: "67890",
        name: "Sal",
        price: 8000,
        tax_rate: "19.00",
        discount_rate: 5,
        unit_measure_id: 70,
        standard_code_id: 1,
        is_excluded: 0,
        tribute_id: 1,
        withholding_taxes: [{ code: "05", withholding_tax_rate: "15.00" }],
        image: salImage,
      },

  ];