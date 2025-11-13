import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FAQSection = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const res = await axios.get(`${apiUrl}/faq`);
        const publishedFaqs =
          res.data?.data?.filter((faq) => faq.status === "published") || [];
        setFaqs(publishedFaqs);
      } catch (err) {
        console.error("Failed to load FAQs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, [apiUrl]);

  return (
    <section className="bg-white py-10 xl:container xl:mx-auto px-4 md:px-8">
      <div className="text-center mb-10">
        <Typography
          variant="h4"
          className="font-bold text-3xl md:text-5xl primaryTextColor"
        >
          Frequently Asked Questions
        </Typography>
        <div className="h-1 w-20 secondaryBgColor mx-auto rounded-full mt-4 shadow-md"></div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <CircularProgress />
        </div>
      ) : (
        <div className="grid  gap-6 max-w-6xl mx-auto">
          {faqs.map((faq) => (
            <Accordion
              key={faq._id}
              className="rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${faq._id}`}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-t-xl"
              >
                <Typography className="font-semibold text-base">
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="bg-white px-4 py-2 text-gray-700 rounded-b-xl">
                <Typography className="text-sm">{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      )}
    </section>
  );
};

export default FAQSection;
