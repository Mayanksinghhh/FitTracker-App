'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from '@nextui-org/react';

interface WorkoutStat {
  date: string;
  duration: number;
  calories: number;
  type: string;
}

export default function WorkoutStats() {
  const [workouts, setWorkouts] = useState<WorkoutStat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BASE_URL}api/workouts/stats`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch workouts (${response.status})`);
        }

        const data: WorkoutStat[] = await response.json();
        setWorkouts(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  if (loading) return <p className="text-center text-lg font-semibold">Loading...</p>;
  if (error) return <p className="text-red-500 text-center text-lg">{error}</p>;

  return (
    <div className="flex justify-center items-center mt-6">
      <Table aria-label="Workout Statistics" removeWrapper className="w-full max-w-4xl border border-gray-300 rounded-lg shadow-md">
        <TableHeader>
          <TableColumn className="text-center font-semibold w-1/4">Date</TableColumn>
          <TableColumn className="text-center font-semibold w-1/4">Duration (min)</TableColumn>
          <TableColumn className="text-center font-semibold w-1/4">Calories Burned</TableColumn>
          <TableColumn className="text-center font-semibold w-1/4">Workout Type</TableColumn>
        </TableHeader>
        <TableBody>
          {workouts.map((workout, index) => (
            <TableRow key={index} className="text-center border-b">
              <TableCell className="py-2">{workout.date}</TableCell>
              <TableCell className="py-2">{workout.duration}</TableCell>
              <TableCell className="py-2">{workout.calories}</TableCell>
              <TableCell className="py-2">{workout.type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
