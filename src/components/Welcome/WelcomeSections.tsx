// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';
import TextContent from '@cloudscape-design/components/text-content';

export function Overview() {
    return (
        <SpaceBetween size={'s'}>
            <Header variant="h2">Overview</Header>
            <Container>
                <SpaceBetween size={'s'}>
                    <TextContent>
                        <Box variant="p">
                            Welcome to the platform designed to streamline your interactions, whether you're a healthcare professional or a pharmaceutical sales representative. Our app allows you to easily record, manage, and generate detailed transcripts of your conversations with patients and colleagues.
                        </Box>
                        <Box variant="p">
                            The app captures both patient discussions with clinicians as well as interactions between healthcare professionals (HCPs) and pharmaceutical sales representatives. It automatically generates structured transcripts and post-meeting summaries to help you maintain comprehensive and organized records.
                        </Box>
                        <Box variant="p">
                            With features such as automatic transcription, note generation, and structured medical term extraction, this tool helps save time and improve the quality of documentation, ensuring you can focus on what matters most—providing quality care and meaningful conversations.
                        </Box>
                    </TextContent>
                </SpaceBetween>
            </Container>
        </SpaceBetween>
    );
}

export function Highlights() {
    return (
        <SpaceBetween size={'s'}>
            <Header variant="h2">Highlights</Header>
            <Container>
                <ul>
                    <li>Record conversations between healthcare professionals and patients or sales representatives.</li>
                    <li>Automatically generate structured transcripts and summaries after each meeting.</li>
                    <li>View comprehensive transcripts with segmented speaker identification.</li>
                    <li>Receive rich insights and medical terminology extraction for enhanced documentation.</li>
                    <li>Integrate with additional tools for medical data analysis and patient insights.</li>
                </ul>
            </Container>
        </SpaceBetween>
    );
}

export function Details() {
    return (
        <SpaceBetween size={'s'}>
            <Header variant="h2">
                <span>Details</span>
            </Header>
            <Container>
                <SpaceBetween size={'s'}>
                    <Box>
                        <b>Key features include:</b>
                        <ul>
                            <li>Automatic generation of clinical notes or meeting summaries based on recorded conversations.</li>
                            <li>Detailed and structured transcripts, organized by speaker (doctor, patient, HCP, sales rep).</li>
                            <li>Segmentation of transcripts into meaningful sections for easy review and action.</li>
                            <li>Evidence mapping and extraction of key medical insights and terminologies from conversations.</li>
                            <li>Support for medical ontologies such as RxNorm, ICD-10-CM, and SNOMED CT.</li>
                        </ul>
                    </Box>
                    <Box>
                        <b>
                            Integrate with{' '}
                            <Link external href="https://aws.amazon.com/comprehend/medical/">
                                Amazon Comprehend Medical
                            </Link>
                        </b>
                        to enhance your transcripts with additional insights:
                        <ul>
                            <li>Detect medical terms and concepts directly from conversations.</li>
                            <li>Link extracted terms to standard medical ontologies, enhancing the accuracy of your documentation.</li>
                        </ul>
                    </Box>
                </SpaceBetween>
            </Container>
        </SpaceBetween>
    );
}

export function Footer() {
    return (
        <Container>
            <Box textAlign="center" color="text-body-secondary" fontSize="body-s">
                <p>Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.</p>
                <p>
                    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
                    associated documentation files (the &quot;Software&quot;), to deal in the Software without
                    restriction, including without limitation the rights to use, copy, modify, merge, publish,
                    distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
                    Software is furnished to do so.
                </p>
                <p>
                    THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
                    INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
                    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES
                    OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
                    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
                </p>
            </Box>
        </Container>
    );
}
