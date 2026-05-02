"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-h3">Overall Score</CardTitle>
            <CardDescription>Across all platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-display">82</div>
            <p className="text-small text-muted-foreground">+3.2% from last week</p>
          </CardContent>
        </Card>
        {/* Other metric cards */}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-h2">Recent Analyses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Platform</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Caption</TableHead>
                <TableHead>Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Badge variant="secondary">Instagram</Badge>
                </TableCell>
                <TableCell>88</TableCell>
                <TableCell className="max-w-xs truncate">
                  The secret to perfect content is...
                </TableCell>
                <TableCell>2 hours ago</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/analyser/123">View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
