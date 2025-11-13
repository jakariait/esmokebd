import React, { useEffect } from 'react';
import useGeneralInfoStore from '../../store/GeneralInfoStore';

const Footer = () => {
  const { GeneralInfoList, GeneralInfoListRequest } = useGeneralInfoStore();

  useEffect(() => {
    const fetchData = async () => {
      await GeneralInfoListRequest(); // Fetch data from Zustand store
    };
    fetchData();
  }, [GeneralInfoListRequest]);

  const currentYear = new Date().getFullYear();

  return (
    <div className="shadow rounded-lg mt-6 p-4">
      <div className="flex justify-between items-center">
        <div>
          {currentYear} © {GeneralInfoList?.CompanyName}
        </div>
        <div>
          <p>
            Design and Developed by{" "}
            <a
              href="https://www.digiweb.digital/"
              className={"text-red-500 hover:underline"}
            >
              DigiWeb
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
