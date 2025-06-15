import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProficiencyTestResultProps {
  score: number;
  proficiencyLevel: string;
}

const ProficiencyTestResult: React.FC<ProficiencyTestResultProps> = ({ score, proficiencyLevel }) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Test Results</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-lg">You scored {score}%!</p>
        <p className="text-xl font-semibold">Your proficiency level is: {proficiencyLevel}</p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href="/dashboard" passHref>
          <Button>Back to Dashboard</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProficiencyTestResult;