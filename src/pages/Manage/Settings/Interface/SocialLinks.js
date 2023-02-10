import React, { useState } from 'react'
import styled from 'styled-components'
import {
  FaTimes,
  FaAngleDown,
} from 'react-icons/fa'
import {
  TextField,
  Accordion,
  AccordionSummary,
  Typography,
  List,
  ListItem,
  Divider,
} from '@mui/material'
import * as s from "../../../../styles/global";
import { isWebUri } from '../../../../utils/url';

const Overflow = styled.span`
  overflow-x: auto;
`;

const RemoveButton = styled.button`
  border: none;
  background-color: transparent;
  color: inherit;
  width: auto;
  padding: 0.3rem;
`;

const AddButton = styled(s.button)`
  margin-left: 0.5rem;
`;

const NewItemWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
`;

export default function SocialLinks({socialLinks, setSocialLinks}) {
  const [newLink, setNewItem] = useState('');
  const [linkError, setLinkError] = useState(false);

  const onRemove = (targetIndex) => {
    setSocialLinks((prevItems) => prevItems.filter((_, index) => index !== targetIndex));
  }

  const onNewItemChange = (event) => {
    setLinkError(false);
    setNewItem(event.target.value);
  }

  const onAdd = () => {
    if (isWebUri(newLink)) {
      setSocialLinks((prevLinks) => [...prevLinks, newLink]);
      setNewItem('');
    } else {
      setLinkError(true);
    }
  }

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<FaAngleDown />}
        aria-controls="social-links-content"
        id="social-links-header"
      >
        <Typography>Social Links</Typography>
      </AccordionSummary>
      <List>
        <Divider />
        {socialLinks?.length > 0 && socialLinks?.map((link, index) => (
          <React.Fragment key={index}>
            <ListItem style={{ justifyContent: 'space-between' }}>
              <Overflow>{link}</Overflow>
              <RemoveButton type="button" onClick={() => onRemove(index)} title="Remove item">
                <FaTimes />
              </RemoveButton>
            </ListItem>

            <Divider />
          </React.Fragment>
        ))}
      </List>

      <NewItemWrapper>
        <TextField
          fullWidth
          error={linkError}
          label="URL"
          placeholder="https:/.."
          value={newLink}
          onChange={onNewItemChange}
        />
        <AddButton onClick={onAdd} disabled={!newLink}>Add</AddButton>
      </NewItemWrapper>
    </Accordion>
  )
}
