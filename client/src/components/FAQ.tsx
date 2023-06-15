import React from "react";
import { Box, useTheme, Typography } from "@mui/material";
import Header from "./Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../theme";

const FAQ: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  type FAQItemProps = {
    question: string;
    answer: string;
  };

  const FAQItem = (props: FAQItemProps) => {
    return (
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h4" fontWeight="bold">
            {props.question}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h5">{props.answer}</Typography>
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <Box m="20px">
      <Header title="FAQ" subtitle="Frequently Asked Questions Page" />

      <FAQItem
        question="An inportant question"
        answer="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent venenatis arcu libero, id laoreet felis
            lacinia et."
      />
      <FAQItem
        question="Another inportant question"
        answer="Proin laoreet pretium sem, non iaculis sapien viverra in. Cras tortor arcu, dictum vel commodo id, dictum quis mi."
      />
    </Box>
  );
};

export default FAQ;
