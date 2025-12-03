
import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye } from '@fortawesome/free-solid-svg-icons';
export default function LeaveListings({ leavelisting }) {
  //  const history = useHistory();
  const basepath = process.env.NEXT_PUBLIC_WEBSITE_BASE_URL;

  return (
    <>
      <table className="table">
        <thead>
          <tr>

            <th scope="col">Leave Type</th>
            <th scope="col">Leave From</th>
            <th scope="col">Leave To</th>
            <th scope="col">Number Of days</th>
            <th scope="col">Leave Reason</th>
            <th scope="col">Status</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {leavelisting.map((item) => (
            <tr key={item.id}>
              <td>{item.leaveType}</td>
              <td>{item.fromDate}</td>
              <td>{item.toDate}</td>
              <td>{item.numberOfLeaveDays}</td>
              <td>{item.leaveReason}</td>
              <td>{item.status}</td>
              <td className="text-center">
                <div className="btn-group-horizontal">
                  <Link href={`${basepath}/addleave/${item.idLeave}`}><FontAwesomeIcon icon={faEdit} /></Link>

                  <Link href={`${basepath}/addleave/${item.idLeave}`}>
                    <FontAwesomeIcon icon={faEye} />
                  </Link>
                </div>
              </td>
            </tr>
          ))}

        </tbody>
      </table>
    </>

  );
}
