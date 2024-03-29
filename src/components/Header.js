import React from 'react';
import { Card, CardBody, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Header = ({ head }) => {
  const router = useNavigate();

  return (
    <Card className="my-2 bg-dark text-white">
      <CardBody className="d-flex justify-content-between align-items-center">
        <h2 className="m-3 text-center">{head}</h2>
        <Button variant="light" onClick={() => router('/')}>
          Logout
        </Button>
      </CardBody>
    </Card>
  );
};

export default Header;
